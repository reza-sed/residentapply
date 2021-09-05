import { IResolvers } from "apollo-server-express";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV_VARIABLES } from "../../utils/env";
import { ObjectId } from "mongodb";
import {
  RequestUser,
  Viewer,
  UserInput,
  HostListingValidationSchema,
  ResponseMessage,
  HostListingArgs,
} from "../../utils/lib/types";
import { Database, Listing, User } from "../../database/dbTypes";
import * as yup from "yup";
import { geocode } from "../../utils/services/location-geocode";

const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  signed: true,
};

const newLogin = async (
  loginInput: UserInput,
  db: Database,
  res: Response
): Promise<Viewer> => {
  // check input
  if (!loginInput.username || !loginInput.password) {
    throw new Error("username or password is not provided");
  }

  const foundUser = await db.users.findOne({
    username: loginInput.username,
  });

  if (foundUser) {
    const match = await bcrypt.compare(loginInput.password, foundUser.password);

    if (match) {
      const token = jwt.sign(
        {
          id: foundUser._id.toHexString(),
          username: foundUser.username,
          email: foundUser.email,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          permissions: foundUser.permissions,
        },
        ENV_VARIABLES.SECRET as string,
        {
          algorithm: "HS256",
        }
      );

      // update token in db
      const updatedUser = await db.users.findOneAndUpdate(
        {
          _id: foundUser._id,
        },
        { $set: { token: token } },
        { returnDocument: "after" }
      );

      // create viewer
      const viewer: Viewer = {
        _id: foundUser._id.toHexString(),
        didRequest: true,
        token,
        username: foundUser.username,
        walletId: foundUser.walletId,
      };

      // set token in cookie
      res.cookie("token", token, {
        ...cookieOptions,
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      return viewer;
    }
  }
  throw new Error("provided credentials are not valid");
};

const loginViaCookie = async (
  db: Database,
  user: RequestUser
): Promise<Viewer> => {
  const foundUser = await db.users.findOne({
    username: user.username,
  });

  if (foundUser) {
    // create viewer
    const viewer: Viewer = {
      _id: foundUser._id.toHexString(),
      didRequest: true,
      token: foundUser.token,
      username: foundUser.username,
      walletId: foundUser.walletId,
    };

    return viewer;
  }
  throw new Error("the user is cookie is tampered!");
};

export const mutationResolvers: IResolvers = {
  Mutation: {
    async login(
      _parent: undefined,
      loginInput: UserInput,
      {
        db,
        res,
        user,
      }: { db: Database; res: Response; user: RequestUser | null }
    ): Promise<Viewer> {
      try {
        let viewer = undefined;

        if (user) {
          viewer = await loginViaCookie(db, user);
        } else {
          viewer = await newLogin(loginInput, db, res);
        }
        return viewer;
      } catch (error) {
        return { didRequest: true };
      }
    },
    async registerUser(
      _parent: undefined,
      registerInput: UserInput,
      { db }: { db: Database }
    ): Promise<boolean> {
      // check input fields
      if (
        !registerInput.username ||
        !registerInput.password ||
        !registerInput.email
      ) {
        throw new Error("username, password, email are mandatory fields");
      }

      try {
        const user = { ...registerInput } as User;
        user.bookings = [];
        user.listings = [];
        user.income = 0;
        user.permissions = [];
        user.createdAt = new Date();
        user.updatedAt = new Date();
        user.password = await bcrypt.hash(user.password, 10);
        const res = await db.users.insertOne(user);
        return res.insertedId instanceof ObjectId;
      } catch (error) {
        throw new Error(`error occured ${error.message}`);
      }
    },
    logout: (
      _parent: undefined,
      _args: undefined,
      { res }: { res: Response }
    ): Viewer => {
      try {
        res.clearCookie("token", cookieOptions);
        return { didRequest: true };
      } catch (error) {
        throw new Error("error on loging out");
      }
    },
    addListing: async (
      _parent: undefined,
      { input }: HostListingArgs,
      { db, user }: { db: Database; user: RequestUser | null }
    ): Promise<ResponseMessage<string>> => {
      let response = {} as ResponseMessage<string>;

      if (!user) {
        throw new Error("user is not existed");
      }

      const { description, price, title, type } =
        await HostListingValidationSchema.validate(input);

      if (!description || !price || !title || !type) {
        response.status = 400;
        response.message = "requierd field should be correcly filled";
        return response;
      }

      const { country, admin, city } = await geocode(input.address);
      if (!country || !admin || !city) {
        //throw new Error("invalid address is provided");
        response.status = 400;
        response.message = "the entered address could not be found, try again";
        return response;
      }

      const insertedResult = await db.listings.insertOne({
        _id: new ObjectId(),
        ...input,
        bookings: [],
        bookingsIndex: {},
        city,
        admin,
        country,
        host: user._id,
      });

      await db.users.updateOne(
        { _id: new ObjectId(user._id) },
        { $push: { listings: insertedResult.insertedId } }
      );

      response.status = 201;
      response.message = "sucess";
      response.data = insertedResult.insertedId.toHexString();

      return response;
    },
  },
};

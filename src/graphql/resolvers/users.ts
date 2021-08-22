import { Booking, Database, Listing, User } from "../../database/dbTypes";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ENV_VARIABLES } from "../../utils/env";
import { ObjectId } from "mongodb";
import { RequestUser, Viewer } from "../../utils/lib/types";
import { IResolvers } from "apollo-server-express";
import { Response } from "express";
import { createSecureServer } from "http2";

interface UserInput {
  walletId?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
}

interface UserBookingsData {
  total: number;
  result: Booking[];
}

interface UserListingData {
  total: number;
  result: Listing[];
}

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

export const userResolvers: IResolvers = {
  Query: {
    user: async (
      _parent: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<User> => {
      try {
        const user = await db.users.findOne({ _id: new ObjectId(id) });

        if (!user) {
          throw new Error("user is not existed");
        }

        return user;
      } catch (error) {
        throw new Error(`failed to load user ${error}`);
      }
    },
  },
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
  },
  Viewer: {
    id: (viewer: Viewer): string | undefined => viewer._id,
    hasWallet: (viewer: Viewer): boolean | undefined =>
      viewer.walletId !== undefined,
  },
  User: {
    id: (user: User): string => user._id.toHexString(),
    hasWallet: (user: User): boolean => (user.walletId ? true : false),
    bookings: async (
      user: User,
      { limit, page }: { limit: number; page: number },
      { db }: { db: Database }
    ): Promise<UserBookingsData> => {
      try {
        const data: UserBookingsData = { result: [], total: 0 };

        let cursor = await db.bookings.find({ _id: { $in: user.bookings } });
        // pagination
        cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor = cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (error) {
        throw new Error(`unable to fetch bookings ${error}`);
      }
    },
    listings: async (
      user: User,
      { limit, page }: { limit: number; page: number },
      { db }: { db: Database }
    ): Promise<UserListingData> => {
      try {
        const data: UserListingData = { result: [], total: 0 };

        let cursor = await db.listings.find({ _id: { $in: user.bookings } });
        // pagination
        cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor = cursor.limit(limit);

        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (error) {
        throw new Error(`unable to fetch listings ${error}`);
      }
    },
  },
};

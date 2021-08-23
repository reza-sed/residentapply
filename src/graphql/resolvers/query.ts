import { IResolvers } from "apollo-server-express";
import { ObjectId } from "mongodb";
import { Database, Listing, User } from "../../database/dbTypes";

export const queryResolvers: IResolvers = {
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
    listing: async (
      _parent: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<Listing | undefined> => {
      try {
        return await db.listings.findOne({ _id: new ObjectId(id) });
      } catch (error) {
        throw new Error(`error on fetching listing info ${error}`);
      }
    },
  },
};

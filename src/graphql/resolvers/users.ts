import { Booking, Database, Listing, User } from "../../database/dbTypes";
import { IResolvers } from "apollo-server-express";
import { Viewer } from "../../utils/lib/types";

interface UserBookingsData {
  total: number;
  result: Booking[];
}

interface UserListingData {
  total: number;
  result: Listing[];
}

export const userResolvers: IResolvers = {
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

        let cursor = await db.listings.find({ _id: { $in: user.listings } });
        data.total = await cursor.count();

        // pagination
        cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor = cursor.limit(limit);

        data.result = await cursor.toArray();

        return data;
      } catch (error) {
        throw new Error(`unable to fetch listings ${error}`);
      }
    },
  },
};

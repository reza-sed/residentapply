import { IResolvers } from "apollo-server-express";
import { ObjectId } from "mongodb";
import { Booking, Database, Listing, User } from "../../database/dbTypes";

interface ListingBookingsData {
  total: number;
  result: Booking[];
}

export const listingsResolver: IResolvers = {
  Listing: {
    id: (listing: Listing): string => listing._id.toHexString(),
    host: async (
      listing: Listing,
      _args: undefined,
      { db }: { db: Database }
    ): Promise<User> => {
      const host = await db.users.findOne({ _id: new ObjectId(listing.host) });
      if (!host) {
        throw new Error("specified host is not found");
      }
      return host;
    },
    bookingsIndex: (listing: Listing): string =>
      JSON.stringify(listing.bookingsIndex),
    bookings: async (
      listing: Listing,
      { limit, page }: { limit: number; page: number },
      { db }: { db: Database }
    ): Promise<ListingBookingsData> => {
      try {
        const data: ListingBookingsData = { result: [], total: 0 };

        let cursor = await db.bookings.find({ _id: { $in: listing.bookings } });
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
  },
};

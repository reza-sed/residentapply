import { IResolvers } from "apollo-server-express";
import { Booking, Database, Listing } from "../../database/dbTypes";

export const bookingsResolvers: IResolvers = {
  Booking: {
    id: (boking: Booking): string => boking._id.toHexString(),
    listing: (
      booking: Booking,
      _args: undefined,
      { db }: { db: Database }
    ): Promise<Listing | undefined> => {
      return db.listings.findOne({ _id: booking.listing });
    },
  },
};

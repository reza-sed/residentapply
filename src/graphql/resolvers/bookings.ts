import { IResolvers } from "apollo-server-express";
import { Booking } from "../../database/dbTypes";

export const bookingsResolvers: IResolvers = {
  Booking: {
    id: (boking: Booking): string => boking._id.toHexString(),
  },
};

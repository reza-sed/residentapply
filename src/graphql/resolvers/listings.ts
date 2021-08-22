import { IResolvers } from "apollo-server-express";
import { Listing } from "../../database/dbTypes";

export const listingsResolver: IResolvers = {
  Listing: {
    id: (listing: Listing): string => listing._id.toHexString(),
  },
};

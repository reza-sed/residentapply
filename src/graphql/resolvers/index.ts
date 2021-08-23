import { userResolvers } from "./users";
import { listingsResolver } from "./listings";
import { bookingsResolvers } from "./bookings";
import { queryResolvers } from "./query";
import { mutationResolvers } from "./mutation";

export default {
  ...queryResolvers,
  ...mutationResolvers,
  ...userResolvers,
  ...listingsResolver,
  ...bookingsResolvers,
};

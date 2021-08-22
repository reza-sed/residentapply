import { userResolvers } from "./users";
import { listingsResolver } from "./listings";
import { bookingsResolvers } from "./bookings";

export default { ...userResolvers, ...listingsResolver, ...bookingsResolvers };

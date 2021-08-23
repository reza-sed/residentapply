import { gql } from "apollo-server-express";

export const booking = gql`
  type Booking {
    id: ID!
    listing: Listing!
    tenant: User!
    checkIn: String!
    checkOut: String!
  }

  type Bookings {
    total: Int
    result: [Booking!]!
  }
`;

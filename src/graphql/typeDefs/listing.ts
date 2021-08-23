import { gql } from "apollo-server-express";

export const listing = gql`
  enum ListingType {
    APARTMENT
    HOUSE
    VILLA
  }

  type Listings {
    total: Int
    result: [Listing!]!
  }

  type Listing {
    id: ID!
    title: String!
    description: String!
    image: String!
    host: User!
    type: ListingType!
    address: String!
    city: String!
    bookings(limit: Int!, page: Int!): Bookings
    bookingsIndex: String!
    price: Int!
    numOfGuests: Int!
  }
`;

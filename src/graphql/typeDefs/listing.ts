import { gql } from "apollo-server-express";

export const listing = gql`
  enum ListingType {
    APARTMENT
    HOUSE
    VILLA
  }

  enum ListingsFilter {
    PRICE_LOW_TO_HIGH
    PRICE_HIGH_TO_LOW
  }

  type Listings {
    region: String
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
    admin: String!
    country: String!
    bookings(limit: Int!, page: Int!): Bookings
    bookingsIndex: String!
    price: Int!
    numOfGuests: Int!
  }

  input HostListingInput {
    title: String!
    description: String!
    address: String!
    image: String!
    type: ListingType!
    price: Int!
    numOfGuests: Int!
  }

  type ResponseMessage {
    status: Int!
    message: String!
    data: String
  }
`;

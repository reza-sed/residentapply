import { gql } from "apollo-server-express";

export const user = gql`
  enum ListingType {
    APARTMENT
    HOUSE
    VILLA
  }

  type User {
    id: ID!
    username: String!
    email: String!
    hasWallet: Boolean!
    income: Int
    bookings(limit: Int!, page: Int!): Bookings
    listings(limit: Int!, page: Int!): Listings!
  }

  type Viewer {
    id: ID
    username: String
    token: String
    hasWallet: Boolean
    didRequest: Boolean!
  }
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

  type Listings {
    total: Int
    result: [Listing!]!
  }

  type Query {
    user(id: ID): User!
  }

  type Mutation {
    registerUser(
      firstName: String
      lastName: String
      email: String!
      username: String!
      password: String!
    ): Boolean
    login(username: String, password: String): Viewer
    logout: Viewer!
  }
`;

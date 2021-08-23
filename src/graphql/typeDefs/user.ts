import { gql } from "apollo-server-express";

export const user = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    hasWallet: Boolean!
    income: Int
    avatar: String
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
`;

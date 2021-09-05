import { user } from "./user";
import { listing } from "./listing";
import { booking } from "./booking";
import { gql } from "apollo-server-express";
import { location } from "./location";

const Query = gql`
  type Query {
    listing(id: ID!): Listing!
    user(id: ID): User!
    listings(
      location: String
      filter: ListingsFilter!
      page: Int!
      limit: Int!
    ): Listings!
    locate: Location
  }
`;

const Mutation = gql`
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
    addListing(input: HostListingInput!): ResponseMessage!
  }
`;

export default [Query, Mutation, user, booking, listing, location];

import { gql } from "apollo-server-express";

export const location = gql`
  type Location {
    country_name: String!
    city: String!
  }
`;

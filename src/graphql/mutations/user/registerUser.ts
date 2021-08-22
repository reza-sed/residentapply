import { gql } from "apollo-boost";

export const REGISTER = gql`
  mutation registerUser(
    $firstName: String
    $lastName: String
    $email: String!
    $username: String!
    $password: String!
  ) {
    registerUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      username: $username
      password: $password
    )
  }
`;

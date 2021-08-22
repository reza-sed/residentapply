import { gql } from "apollo-boost";

export const LOGIN = gql`
  mutation login($username: String, $password: String) {
    login(username: $username, password: $password) {
      id
      username
      token
      hasWallet
      didRequest
    }
  }
`;

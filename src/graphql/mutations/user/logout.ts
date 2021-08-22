import { gql } from "apollo-boost";

export const LOGOUT = gql`
  mutation logout {
    logout {
      id
      username
      token
      hasWallet
      didRequest
    }
  }
`;

import { gql } from "apollo-boost";

export const ADD_LISTING = gql`
  mutation ADD_LISTING($input: HostListingInput!) {
    addListing(input: $input) {
      status
      message
      data
    }
  }
`;

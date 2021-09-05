import { gql } from "apollo-boost";

export const LISTINGS = gql`
  query Listings(
    $location: String
    $filter: ListingsFilter!
    $page: Int!
    $limit: Int!
  ) {
    listings(location: $location, filter: $filter, page: $page, limit: $limit) {
      total
      region
      result {
        id
        title
        image
        address
        price
        numOfGuests
      }
    }
  }
`;

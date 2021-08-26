import { gql } from "apollo-boost";

export const LOCATION = gql`
  query Locate {
    locate {
      country_name
      city
    }
  }
`;

import { gql } from "apollo-boost";

export const LISTING = gql`
  query Listing($id: ID!, $bookingPage: Int!, $limit: Int!) {
    listing(id: $id) {
      id
      title
      description
      image
      host {
        id
        username
        avatar
        hasWallet
      }
      type
      address
      city
      bookings(page: $bookingPage, limit: $limit) {
        total
        result {
          id
          tenant {
            id
            username
            avatar
          }
          checkIn
          checkOut
        }
      }
      numOfGuests
      price
      bookingsIndex
    }
  }
`;

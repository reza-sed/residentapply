/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ListingType } from "./../../../../globalTypesFile";

// ====================================================
// GraphQL query operation: Listing
// ====================================================

export interface Listing_listing_host {
  __typename: "User";
  id: string;
  username: string;
  avatar: string | null;
  hasWallet: boolean;
}

export interface Listing_listing_bookings_result_tenant {
  __typename: "User";
  id: string;
  username: string;
  avatar: string | null;
}

export interface Listing_listing_bookings_result {
  __typename: "Booking";
  id: string;
  tenant: Listing_listing_bookings_result_tenant;
  checkIn: string;
  checkOut: string;
}

export interface Listing_listing_bookings {
  __typename: "Bookings";
  total: number | null;
  result: Listing_listing_bookings_result[];
}

export interface Listing_listing {
  __typename: "Listing";
  id: string;
  title: string;
  description: string;
  image: string;
  host: Listing_listing_host;
  type: ListingType;
  address: string;
  city: string;
  bookings: Listing_listing_bookings | null;
  numOfGuests: number;
  price: number;
  bookingsIndex: string;
}

export interface Listing {
  listing: Listing_listing;
}

export interface ListingVariables {
  id: string;
  bookingPage: number;
  limit: number;
}

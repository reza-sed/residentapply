/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ListingsFilter } from "./../../../../globalTypesFile";

// ====================================================
// GraphQL query operation: Listings
// ====================================================

export interface Listings_listings_result {
  __typename: "Listing";
  id: string;
  title: string;
  image: string;
  address: string;
  price: number;
  numOfGuests: number;
}

export interface Listings_listings {
  __typename: "Listings";
  total: number | null;
  region: string | null;
  result: Listings_listings_result[];
}

export interface Listings {
  listings: Listings_listings;
}

export interface ListingsVariables {
  location?: string | null;
  filter: ListingsFilter;
  page: number;
  limit: number;
}
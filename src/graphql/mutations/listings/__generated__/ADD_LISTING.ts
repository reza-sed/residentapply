/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { HostListingInput } from "./../../../../globalTypesFile";

// ====================================================
// GraphQL mutation operation: ADD_LISTING
// ====================================================

export interface ADD_LISTING_addListing {
  __typename: "ResponseMessage";
  status: number;
  message: string;
  data: string | null;
}

export interface ADD_LISTING {
  addListing: ADD_LISTING_addListing;
}

export interface ADD_LISTINGVariables {
  input: HostListingInput;
}

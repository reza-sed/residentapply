/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: logout
// ====================================================

export interface logout_logout {
  __typename: "Viewer";
  id: string | null;
  username: string | null;
  token: string | null;
  hasWallet: boolean | null;
  didRequest: boolean;
}

export interface logout {
  logout: logout_logout;
}

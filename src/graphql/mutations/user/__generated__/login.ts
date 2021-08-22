/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: login
// ====================================================

export interface login_login {
  __typename: "Viewer";
  id: string | null;
  username: string | null;
  token: string | null;
  hasWallet: boolean | null;
  didRequest: boolean;
}

export interface login {
  login: login_login | null;
}

export interface loginVariables {
  username?: string | null;
  password?: string | null;
}

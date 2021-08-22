export interface Viewer {
  _id?: string;
  username?: string;
  token?: string;
  walletId?: string;
  didRequest: boolean;
}

export interface RequestUser {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  permissions?: string[];
}

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

export interface Location {
  city: string;
  country_name: string;
}

export interface GeocodeLocation {
  city: string;
  admin: string;
  country: string;
}

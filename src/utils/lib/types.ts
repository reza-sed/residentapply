import { ListingType } from "../../database/dbTypes";
import * as Yup from "yup";

export interface Viewer {
  _id?: string;
  username?: string;
  token?: string;
  walletId?: string;
  didRequest: boolean;
}

export interface RequestUser {
  _id: string;
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

export interface HostListingInput {
  title: string;
  description: string;
  image: string;
  type: ListingType;
  address: string;
  price: number;
  numOfGuests: number;
}

export interface HostListingArgs {
  input: HostListingInput;
}

export const HostListingValidationSchema = Yup.object({
  title: Yup.string()
    .required()
    .test("len", "maximum length is 100 character", (v) =>
      v ? v?.length <= 100 : false
    ),
  description: Yup.string()
    .required()
    .test("len", "maximum length is 1000 characters", (v) =>
      v ? v.length <= 1000 : false
    ),
  type: Yup.mixed().oneOf(
    Object.values(ListingType),
    "type should be within valid choices"
  ),
  price: Yup.number().min(1, "price should be at least 1$"),
});

export interface UserInput {
  walletId?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
}

export interface ResponseMessage<T> {
  status: number;
  message: string;
  data: T;
}

import { Collection, ObjectId } from "mongodb";

export enum ListingType {
  Apartment = "apartment",
  House = "house",
  Villa = "villa",
}

export interface BookingsIndexMonth {
  [key: string]: boolean;
}

export interface BookingIndexYear {
  [key: string]: BookingsIndexMonth;
}

export interface Booking {
  _id: ObjectId;
  listing: ObjectId;
  tenant: string;
  checkIn: string;
  checkOut: string;
}

export interface Listing {
  _id: ObjectId;
  title: string;
  description: string;
  image: string;
  host: string;
  type: string;
  address: string;
  country: string;
  admin: string;
  city: string;
  bookings: ObjectId[];
  bookingsIndex: BookingIndexYear;
  price: number;
  numOfGuests: number;
}

export interface User {
  _id: ObjectId;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
  walletId: string;
  token?: string;
  createdAt: Date;
  updatedAt: Date;
  permissions: string[];
  income?: number;
  bookings: ObjectId[];
  listings: ObjectId[];
}

export interface Database {
  users: Collection<User>;
  listings: Collection<Listing>;
  bookings: Collection<Booking>;
}

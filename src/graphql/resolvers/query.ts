import { IResolvers } from "apollo-server-express";
import { ObjectId } from "mongodb";
import {
  Database,
  Listing,
  ListingsFilter,
  User,
} from "../../database/dbTypes";
import { ENV_VARIABLES } from "../../utils/env";
import fetch from "node-fetch";
import { GeocodeLocation, Location } from "../../utils/lib/types";
import { geocode } from "../../utils/services/location-geocode";

interface ListingsInput {
  location?: string;
  limit: number;
  page: number;
  filter: ListingsFilter;
}

interface ListingsData {
  region?: string;
  result: Listing[];
  total: number;
}

export const queryResolvers: IResolvers = {
  Query: {
    locate: async (): Promise<Location | null> => {
      const getIp = await fetch("https://api.ipify.org/?format=json");
      if (getIp.ok) {
        const { ip } = (await getIp.json()) as { ip: string };
        const res = await fetch(
          `http://api.ipstack.com/${ip}?access_key=${ENV_VARIABLES.IP_STACK_SECRET}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.ok) {
          const data = (await res.json()) as Location;
          return data;
        }
      }
      return null;
    },
    user: async (
      _parent: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<User> => {
      try {
        const user = await db.users.findOne({ _id: new ObjectId(id) });

        if (!user) {
          throw new Error("user is not existed");
        }

        return user;
      } catch (error) {
        throw new Error(`failed to load user ${error}`);
      }
    },
    listing: async (
      _parent: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<Listing | undefined> => {
      try {
        return await db.listings.findOne({ _id: new ObjectId(id) });
      } catch (error) {
        throw new Error(`error on fetching listing info ${error}`);
      }
    },
    listings: async (
      _parent: undefined,
      { location, page, limit, filter }: ListingsInput,
      { db }: { db: Database }
    ): Promise<ListingsData> => {
      try {
        const data: ListingsData = { result: [], total: 0 };
        let query = {} as GeocodeLocation;

        if (location) {
          const { admin, city, country } = await geocode(location);

          if (admin) query.admin = admin;
          if (city) query.city = city;
          if (country) query.country = country;
          else throw new Error("could not find the requested location");

          const cityRegion = city ? `${city} ,` : "";
          const adminRegion = admin ? `${admin} ,` : "";
          data.region = `${cityRegion}${adminRegion}${country}`;
        }

        let cursor = await db.listings.find(query);

        if (filter && filter === ListingsFilter.PriceLowToHigh) {
          cursor = cursor.sort({ price: 1 });
        }
        if (filter && filter === ListingsFilter.PriceHighToLow) {
          cursor = cursor.sort({ price: -1 });
        }

        data.total = await cursor.count();

        // pagination
        cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor = cursor.limit(limit);

        data.result = await cursor.toArray();

        return data;
      } catch (error) {
        throw new Error(`unable to fetch listings ${error}`);
      }
    },
  },
};

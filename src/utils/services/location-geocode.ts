import { ENV_VARIABLES } from "../env";
import { GeocodeLocation } from "../lib/types";
import fetch from "node-fetch";

export const geocode = async (
  searchLocation: string
): Promise<GeocodeLocation> => {
  let foundLocation = {} as GeocodeLocation;

  const encodedSeachLocation = encodeURIComponent(searchLocation);
  const query = `https://geocode.search.hereapi.com/v1/geocode?q=${encodedSeachLocation}&apiKey=${ENV_VARIABLES.HERE_API_KEY}`;

  const res = await fetch(query, {
    headers: { "content-type": "application/json" },
  });

  if (res.ok) {
    const { items } = await res.json();

    if (items && items.length > 0) {
      foundLocation.admin = items[0].address.state;
      foundLocation.city = items[0].address.city;
      foundLocation.country = items[0].address.countryName;
    }
  }

  return foundLocation;
};

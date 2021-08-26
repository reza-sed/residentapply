import { allow, and, deny, or, rule, shield } from "graphql-shield";
import { User } from "./dbTypes";

function checkPermission(user: User, permission: string) {
  if (user) {
    return user.permissions.includes(permission);
  }
  return false;
}

const isAuthenticated = rule()((parent, args, { user }) => {
  return user !== null;
});

const isUserAuthorized = rule()((parent, { id }, { user }) => {
  return user.id == parent._id.toHexString();
});

const isListingAuthorized = rule()((parent, { id }, { user }) => {
  return user.id == parent.host;
});

export default shield(
  {
    Mutation: {
      registerUser: allow,
      login: allow,
      logout: isAuthenticated,
    },
    Query: {
      user: isAuthenticated,
    },
    User: {
      income: isUserAuthorized,
      bookings: isUserAuthorized,
    },
    Listing: {
      bookings: isListingAuthorized,
    },
  },
  { debug: true }
);

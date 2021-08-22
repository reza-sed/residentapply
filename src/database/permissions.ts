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

const isAuthorized = rule()((parent, { id }, { user }) => {
  return user._id === parent.id;
});

export default shield(
  {
    Mutation: {
      registerUser: allow,
      login: allow,
    },
    Query: {
      user: isAuthenticated,
    },
    User: {
      income: isAuthorized,
      bookings: isAuthorized,
    },
  },
  { debug: true }
);

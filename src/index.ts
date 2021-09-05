require("dotenv").config();
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import express, { Application } from "express";
import { connectToDB } from "./database";
import { ENV_VARIABLES } from "./utils/env";
import expressjwt from "express-jwt";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";
import permissions from "./database/permissions";
import { applyMiddleware } from "graphql-middleware";
import cookieParser from "cookie-parser";

const app = express();

if (!ENV_VARIABLES.SECRET) throw new Error("secrect is not defined!");
if (!ENV_VARIABLES.COOKIE_SECRET)
  throw new Error("cookie secret is not defined!");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use(cookieParser(ENV_VARIABLES.COOKIE_SECRET));

app.use(
  expressjwt({
    secret: ENV_VARIABLES.SECRET,
    getToken: (req) => req.signedCookies.token,
    credentialsRequired: false,
    algorithms: ["HS256"],
  })
);

const loadServer = async (app: Application) => {
  // connect to database
  const db = await connectToDB();

  // config graphql endpoint
  const server = new ApolloServer({
    schema: applyMiddleware(
      makeExecutableSchema({ typeDefs, resolvers }),
      permissions
    ),
    context: ({ req, res }) => {
      const user = req.user || null;
      return { db, user, res };
    },
  });

  server.applyMiddleware({ app });

  app.listen(ENV_VARIABLES.PORT, () => {
    console.log(
      `[app]: server is running at port ${ENV_VARIABLES.PORT} graphqlendpoint ${server.graphqlPath}`
    );
  });
};

loadServer(app);

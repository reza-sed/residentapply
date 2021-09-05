import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  Home,
  AppHeader,
  Host,
  Listing,
  Listings,
  User,
  NotFound,
  Login,
  Signup,
} from "./components";
import Layout from "antd/lib/layout/layout";
import { Viewer } from "./utils/lib/types";
import ApolloClient from "apollo-boost";
import { ApolloProvider, useMutation } from "@apollo/react-hooks";
import { Affix } from "antd";
import { useEffect } from "react";
import { LOGIN } from "./graphql/mutations";
import {
  login as LoginData,
  loginVariables as LoginVars,
} from "./graphql/mutations/user/__generated__/login";
import { useRef } from "react";

const intialViewer: Viewer = {
  id: null,
  token: null,
  username: null,
  hasWallet: null,
  didRequest: false,
};

const apolloClient = new ApolloClient({ uri: "/graphql" });

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(intialViewer);
  const [loginFn, { error: loginError }] = useMutation<LoginData, LoginVars>(
    LOGIN,
    {
      onCompleted: (data) => {
        if (data && data.login) {
          setViewer(data.login);
        }
      },
    }
  );

  const loginRef = useRef(loginFn);

  useEffect(() => {
    loginRef.current();
  }, []);

  return (
    <Router>
      <Layout id="app">
        <Affix offsetTop={0}>
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/listings/:location?" component={Listings} />
          <Route exact path="/listing/:id" component={Listing} />
          <Route
            exact
            path="/host"
            render={(props) => <Host {...props} viewer={viewer} />}
          />
          <Route exact path="/signup" component={Signup} />
          <Route
            exact
            path="/login"
            render={(props) => <Login {...props} setViewer={setViewer} />}
          />
          <Route
            exact
            path="/user/:id"
            render={(props) => <User {...props} viewer={viewer} />}
          />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

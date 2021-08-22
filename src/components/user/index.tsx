import { useQuery } from "@apollo/react-hooks";
import { RouteComponentProps } from "react-router-dom";
import React from "react";
import { USER } from "../../graphql/queries";
import {
  User as UserData,
  UserVariables,
} from "../../graphql/queries/user/__generated__/User";
import { Row, Col, Layout } from "antd";
import UserProfile from "./components/user-profile";
import { Viewer } from "../../utils/lib/types";
import { PageSkeleton } from "../../utils/components";
import ErrorElement from "../../utils/components/error";
import { useState } from "react";
import UserListings from "./components/user-listings";
import UserBookings from "./components/user-bookings";

interface MatchParams {
  id: string;
}

interface Props {
  viewer: Viewer;
}

const { Content } = Layout;
const PAGE_LIMIT = 4;
export const User = ({
  match,
  viewer,
}: RouteComponentProps<MatchParams> & Props) => {
  const [bookingsPage, setBookingsPage] = useState(1);
  const [listingsPage, setListingsPage] = useState(1);

  const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
    variables: {
      id: match.params.id,
      bookingsPage,
      listingsPage,
      limit: PAGE_LIMIT,
    },
  });

  const user = data ? data.user : null;
  const viewerIsUser = viewer.id === match.params.id;
  const userProfileElement = user ? (
    <UserProfile user={user} viewerIsUser={viewerIsUser} />
  ) : null;

  const UserListingsElemet = user ? (
    <UserListings
      userListings={user.listings}
      listingsPage={listingsPage}
      limit={PAGE_LIMIT}
      setListingsPage={setListingsPage}
    />
  ) : null;

  const UserBookingsElemet = user ? (
    <UserBookings
      userBookings={user.bookings}
      bookingsPage={bookingsPage}
      limit={PAGE_LIMIT}
      setBookingsPage={setBookingsPage}
    />
  ) : null;

  if (loading) {
    return (
      <Content className="user">
        <PageSkeleton />
      </Content>
    );
  }

  if (error) {
    console.log(error);
    return (
      <Content className="user">
        <ErrorElement description="this user may not exist!" />
        <PageSkeleton />
      </Content>
    );
  }

  return (
    <Content className="user">
      <Row gutter={12} justify="space-between">
        <Col xs={24}>{userProfileElement}</Col>
        <Col xs={24}>
          {UserListingsElemet}
          {user?.bookings ? UserBookingsElemet : null}
        </Col>
      </Row>
    </Content>
  );
};

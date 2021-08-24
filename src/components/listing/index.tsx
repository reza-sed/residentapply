import { useQuery } from "@apollo/react-hooks";
import React from "react";
import { LISTING } from "../../graphql/queries/listing";
import { RouteComponentProps } from "react-router-dom";
import {
  Listing as ListingData,
  ListingVariables,
} from "../../graphql/queries/listing/__generated__/Listing";
import { useState } from "react";
import { PageSkeleton } from "../../utils/components";
import { Col, Layout, Row } from "antd";
import ErrorElement from "../../utils/components/error";
import ListingDetail from "./components/listing-detail";
import ListingBookings from "./components/listing-booking";
import CreateBooking from "./components/create-booking";
import { Moment } from "moment";

interface MatchParam {
  id: string;
}

const LIST_LIMIT = 4;
const { Content } = Layout;

export const Listing = ({ match }: RouteComponentProps<MatchParam>) => {
  const [bookingPage, setBookingPage] = useState<number>(1);

  const [checkInDate, setCheckInDate] = useState<Moment | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Moment | null>(null);

  const { data, loading, error } = useQuery<ListingData, ListingVariables>(
    LISTING,
    {
      variables: { id: match.params.id, limit: LIST_LIMIT, bookingPage },
      errorPolicy: "all",
    }
  );

  if (loading) {
    return (
      <Content className="listing">
        <PageSkeleton />
      </Content>
    );
  }

  if (!data && error) {
    return (
      <Content className="listing">
        <ErrorElement description="Could not fetch information of selected listing" />
        <PageSkeleton />
      </Content>
    );
  }

  const listing = data ? data.listing : null;
  const listingBookings = listing ? listing.bookings : null;

  const ListingDetailElement = listing ? (
    <ListingDetail listing={listing} />
  ) : null;

  const ListingBookingElement = listing?.bookings ? (
    <ListingBookings
      bookingsPage={bookingPage}
      setBookingsPage={setBookingPage}
      listingBookings={listingBookings}
      limit={LIST_LIMIT}
    />
  ) : null;

  const CreateBookingElement = listing ? (
    <CreateBooking
      price={listing.price}
      checkInDate={checkInDate}
      checkOutDate={checkOutDate}
      setCheckInDate={setCheckInDate}
      setCheckOutDate={setCheckOutDate}
    />
  ) : null;

  return (
    <Content className="listing">
      <Row gutter={24} justify="space-between">
        <Col xs={24} lg={14}>
          {ListingDetailElement}
          {ListingBookingElement}
        </Col>
        <Col xs={24} lg={10}>
          {CreateBookingElement}
        </Col>
      </Row>
    </Content>
  );
};

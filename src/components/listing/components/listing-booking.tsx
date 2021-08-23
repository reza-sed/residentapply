import React from "react";
import { List, Typography } from "antd";
import { Listing } from "../../../graphql/queries/listing/__generated__/Listing";
import Avatar from "antd/lib/avatar/avatar";

interface Props {
  listingBookings: Listing["listing"]["bookings"];
  bookingsPage: number;
  limit: number;
  setBookingsPage: (bookingsPage: number) => void;
}

const { Title, Text } = Typography;

export default function ListingBookings({
  listingBookings,
  bookingsPage,
  setBookingsPage,
  limit,
}: Props) {
  const result = listingBookings ? listingBookings.result : null;
  const total = listingBookings ? listingBookings.total : null;
  return (
    <div className="listing-bookings">
      <Title level={4}>Bookings</Title>
      <List
        grid={{ gutter: 8, xs: 1, sm: 2, lg: 4 }}
        dataSource={result ?? undefined}
        locale={{ emptyText: "no bookings up until now" }}
        pagination={{
          position: "bottom",
          current: bookingsPage,
          total: total ?? undefined,
          defaultPageSize: limit,
          hideOnSinglePage: true,
          showLessItems: true,
          onChange: (page: number) => setBookingsPage(page),
        }}
        renderItem={(listingBookings) => {
          const bookingDetail = (
            <div>
              <div>
                Check in: <Text strong>{listingBookings.checkIn}</Text>
              </div>
              <div>
                Check out: <Text strong>{listingBookings.checkOut}</Text>
              </div>
            </div>
          );
          return (
            <List.Item>
              {bookingDetail}
              <Avatar
                src={listingBookings.tenant.avatar}
                size={64}
                shape="square"
              />
            </List.Item>
          );
        }}
      ></List>
    </div>
  );
}

import React from "react";
import { List, Typography } from "antd";
import { User } from "../../../graphql/queries/user/__generated__/User";
import { ListingCard } from "../../../utils/components";

interface Props {
  userBookings: User["user"]["bookings"];
  bookingsPage: number;
  limit: number;
  setBookingsPage: (bookingsPage: number) => void;
}

const { Paragraph, Title, Text } = Typography;

export default function UserBookings({
  userBookings,
  bookingsPage,
  setBookingsPage,
  limit,
}: Props) {
  const result = userBookings ? userBookings.result : null;
  const total = userBookings ? userBookings.total : null;
  return (
    <div>
      <Title level={4}>Bookings</Title>
      <Paragraph>user's booked accomodation</Paragraph>
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
        renderItem={(userBookings) => {
          const bookingDetail = (
            <div>
              <div>
                Check in: <Text strong>{userBookings.checkIn}</Text>
              </div>
              <div>
                Check out: <Text strong>{userBookings.checkOut}</Text>
              </div>
            </div>
          );
          return (
            <List.Item>
              {bookingDetail}
              <ListingCard listing={userBookings.listing} />
            </List.Item>
          );
        }}
      ></List>
    </div>
  );
}

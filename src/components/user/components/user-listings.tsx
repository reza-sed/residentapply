import React from "react";
import { List, Typography } from "antd";
import { User } from "../../../graphql/queries/user/__generated__/User";
import { ListingCard } from "../../../utils/components";

interface Props {
  userListings: User["user"]["listings"];
  listingsPage: number;
  limit: number;
  setListingsPage: (listingsPage: number) => void;
}

const { Paragraph, Title } = Typography;

export default function UserListings({
  userListings,
  listingsPage,
  setListingsPage,
  limit,
}: Props) {
  return (
    <div>
      <Title level={4}>Listings</Title>
      <Paragraph>
        user's available listings which could be applied for accomodation
      </Paragraph>
      <List
        grid={{ gutter: 8, xs: 1, sm: 2, lg: 4 }}
        dataSource={userListings.result}
        locale={{ emptyText: "nothing" }}
        pagination={{
          position: "bottom",
          current: listingsPage,
          total: userListings.total ?? undefined,
          defaultPageSize: limit,
          hideOnSinglePage: true,
          showLessItems: true,
          onChange: (page: number) => setListingsPage(page),
        }}
        renderItem={(userlisting) => (
          <List.Item>
            <ListingCard listing={userlisting} />
          </List.Item>
        )}
      ></List>
    </div>
  );
}

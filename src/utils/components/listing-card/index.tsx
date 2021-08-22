import React, { Fragment } from "react";
import { Typography, Card } from "antd";
import { UserOutlined } from "@ant-design/icons";

interface Props {
  listing: {
    id: string;
    title: string;
    image: string;
    address: string;
    price: number;
    numOfGuests: number;
  };
}

const { Text, Title } = Typography;

export const ListingCard = ({ listing }: Props) => {
  return (
    <Card
      hoverable
      cover={<div style={{ backgroundImage: `url(${listing.image})` }} />}
    >
      <div>
        <Title level={4}>
          {listing.price}
          <span>/day</span>
        </Title>
        <Text strong ellipsis>
          {listing.title}
        </Text>
        <Text strong ellipsis>
          {listing.address}
        </Text>
        <div>
          <UserOutlined />
          <Text>{listing.numOfGuests} guests</Text>
        </div>
      </div>
    </Card>
  );
};

import { EnvironmentOutlined } from "@ant-design/icons";
import { Avatar, Divider, Tag, Typography } from "antd";
import { Listing as ListingData } from "../../../graphql/queries/listing/__generated__/Listing";
import { Link } from "react-router-dom";

interface Props {
  listing: ListingData["listing"];
}

const { Title, Paragraph } = Typography;

export default function ListingDetail({ listing }: Props) {
  return (
    <div className="listing-detail">
      <div
        className="listing-detail__image"
        style={{
          backgroundImage: `url(${listing.image})`,
          backgroundSize: "cover",
        }}
      />
      <div className="listing-detail__information">
        <Paragraph type="secondary" ellipsis>
          <Link to={`/listings/${listing.city}`}>
            <EnvironmentOutlined /> {listing.city}
          </Link>
          <Divider type="vertical" />
          {listing.address}
        </Paragraph>
        <Title level={4}>{listing.title}</Title>
      </div>
      <div className="listing-detail__host">
        <Link to={`/user/${listing.host.id}`}>
          <Avatar
            className="listing-detail__host-image"
            src={listing.host.avatar}
            size={64}
          />
          <Title className="listing-detail__host-title" level={2}>
            {listing.host.username}
          </Title>
        </Link>
      </div>
      <Divider />
      <div>
        <Title level={4}>About this:</Title>
        <div>
          <Tag style={{ textTransform: "lowercase" }} color="magenta">
            {listing.type}
          </Tag>
          <Tag color="magenta">{listing.numOfGuests} Guests</Tag>
        </div>
        <Paragraph ellipsis={{ rows: 3, expandable: true }}>
          {listing.description}
        </Paragraph>
      </div>
    </div>
  );
}

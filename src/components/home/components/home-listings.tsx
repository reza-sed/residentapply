import { Typography, List } from "antd";
import { Listings } from "../../../graphql/queries/listings/__generated__/Listings";
import { ListingCard } from "../../../utils/components";

interface Props {
  title: string;
  listings: Listings["listings"]["result"];
}

const { Title } = Typography;

export default function HomeListings({ title, listings }: Props) {
  return (
    <div className="home-listings">
      <Title level={4}>{title}</Title>
      <List
        grid={{ gutter: 18, xs: 1, lg: 4, md: 2 }}
        dataSource={listings}
        renderItem={(listing) => (
          <List.Item>
            <ListingCard listing={listing} />
          </List.Item>
        )}
      />
    </div>
  );
}

import { Card, List, Skeleton } from "antd";
import listingLoading from "../assets/listing-loading-card-cover.jpg";

export default function ListingsSkeleton() {
  const dataPlaceholders = [{}, {}, {}, {}];
  return (
    <div className="home-listings">
      <Skeleton paragraph={{ rows: 0 }} />
      <List
        grid={{ gutter: 8, xs: 1, lg: 4, sm: 2 }}
        dataSource={dataPlaceholders}
        renderItem={(listing) => (
          <List.Item>
            <Card
              className="listing-card"
              cover={
                <img
                  src={listingLoading}
                  className="listing-card__image"
                  alt="loading"
                />
              }
              loading
            />
          </List.Item>
        )}
      />
    </div>
  );
}

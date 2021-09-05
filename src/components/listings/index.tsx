import { useQuery } from "@apollo/react-hooks";
import { Layout, List, Typography } from "antd";
import React, { Fragment, useState, useRef } from "react";
import { RouteComponentProps } from "react-router-dom";
import { ListingsFilter } from "../../globalTypesFile";
import { LISTINGS } from "../../graphql/queries";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../graphql/queries/listings/__generated__/Listings";
import { ListingCard } from "../../utils/components";
import FilterListings from "./components/filter-listings";
import ListingsSkeleton from "./components/listings-skeleton";
import PaginateListings from "./components/paginate-listings";
import ErrorElement from "../../utils/components/error";
import { useEffect } from "react";

const { Content } = Layout;
const { Title } = Typography;

const PAGE_LIMIT = 8;

interface MatchProps {
  location?: string;
}

export const Listings = ({ match }: RouteComponentProps<MatchProps>) => {
  const ref = useRef(match.params.location);
  const [filter, setFilter] = useState(ListingsFilter.PRICE_LOW_TO_HIGH);
  const [page, setPage] = useState(1);

  const { data, loading, error } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      skip: ref.current !== match.params.location && page !== 1,
      variables: {
        location: match.params.location,
        limit: PAGE_LIMIT,
        page,
        filter,
      },
    }
  );

  useEffect(() => {
    setPage(1);
    ref.current = match.params.location;
  }, [match.params.location]);

  const ListingsElement =
    data && data.listings && data.listings.total ? (
      <Fragment>
        <List
          header={
            <div className="listings__head">
              <FilterListings filter={filter} setFilter={setFilter} />
              <PaginateListings
                page={page}
                setPage={setPage}
                total={data.listings.total}
                limit={PAGE_LIMIT}
              />
            </div>
          }
          grid={{ gutter: 8, lg: 4, sm: 2, xs: 1 }}
          dataSource={data.listings.result}
          renderItem={(listing) => (
            <List.Item>
              <ListingCard listing={listing} />
            </List.Item>
          )}
        />
      </Fragment>
    ) : null;

  const ListingRegionElement =
    data && data.listings ? (
      <Title level={3}>{data.listings.region}</Title>
    ) : null;

  if (loading) {
    return (
      <Content className="listings">
        <ListingsSkeleton />
      </Content>
    );
  }

  if (error) {
    return (
      <Content className="listings">
        <ErrorElement description="it seems that the keyword you have entered could not be found, try again with another keywords" />
        <ListingsSkeleton />
      </Content>
    );
  }

  return (
    <Content className="listings">
      {ListingRegionElement}
      {ListingsElement}
    </Content>
  );
};

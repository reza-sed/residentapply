import React from "react";
import { Col, Layout, Row, Typography } from "antd";
import HomeHero from "./components/home-hero";
import { object, string } from "yup";
import mapBackground from "./assets/world-map.png";
import { Link, useHistory } from "react-router-dom";
import { displayError } from "../../utils";
import { useQuery } from "@apollo/react-hooks";
import { LISTINGS, LOCATION } from "../../graphql/queries";
import { Locate as LocationData } from "../../graphql/queries/location/__generated__/Locate";

import sanFransisco from "./assets/san-francisco.jpg";
import tehran from "./assets/tehran.jpg";
import {
  Listings as ListingsData,
  ListingsVariables,
} from "../../graphql/queries/listings/__generated__/Listings";
import { ListingsFilter } from "../../globalTypesFile";
import HomeListings from "./components/home-listings";
import ListingsSkeleton from "./components/listings-skeleton";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const LISTING_LIMIT = 4;
const LISTING_PAGE = 1;

export const Home = () => {
  const { data: locationData } = useQuery<LocationData>(LOCATION);
  const { data, error, loading } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      variables: {
        limit: LISTING_LIMIT,
        page: LISTING_PAGE,
        filter: ListingsFilter.PRICE_LOW_TO_HIGH,
      },
    }
  );

  const location =
    locationData && locationData.locate
      ? locationData.locate.country_name
      : "united@20states";

  const history = useHistory();

  const handleSearch = (searchvalue: string) => {
    let shema = object().shape({ searchvalue: string().required() });
    if (shema.isValidSync({ searchvalue }))
      history.push(`/listings/${searchvalue}`);
    else displayError("please enter valid search");
  };

  const renderListingsSection = () => {
    if (loading) {
      return <ListingsSkeleton />;
    }

    if (data) {
      return (
        <HomeListings
          title="Premium Listings"
          listings={data.listings.result}
        />
      );
    }

    return null;
  };

  return (
    <Content style={{ background: `url(${mapBackground}) no-repeat` }}>
      <HomeHero search={handleSearch} />
      <div className="home__local">
        <Title level={2}>Find best locations</Title>
        <Paragraph>
          help you with the best oppurtunities you can ever had in finding the
          best place to stay
        </Paragraph>
        <Link
          className="ant-btn ant-btn-primary ant-btn-lg"
          to={`/listings/${location}`}
        >
          See the best places nearby
        </Link>
      </div>

      {renderListingsSection()}

      <div className="home__listings">
        <Title level={4}>Popular listings</Title>
        <Row justify="space-between" gutter={12}>
          <Col xs={24} sm={12}>
            <Link to="/listings/san%20fransisco">
              <img
                className="home__listings-image"
                src={sanFransisco}
                alt="san fransisco"
              />
              <span className="home__listings-image-title">
                Have you heard about Goldnen Gate? Stay in San Fransisco
              </span>
            </Link>
          </Col>
          <Col xs={24} sm={12}>
            <Link to="/listings/tehran">
              <img className="home__listings-image" src={tehran} alt="tehran" />
              <span className="home__listings-image-title">
                Want to stay in a wonderful place? Visit Tehran
              </span>
            </Link>
          </Col>
        </Row>
      </div>
    </Content>
  );
};

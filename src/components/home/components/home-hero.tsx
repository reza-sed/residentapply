import dubaiImage from "./../assets/dubai.jpg";
import dubaiThumbImage from "./../assets/dubai-thumb.jpg";
import LAImage from "./../assets/LA.jpg";
import torontoImage from "./../assets/toronto.jpg";
import londonImage from "./../assets/london.jpg";
import { Card, Col, Image, Input, Row, Typography } from "antd";
import { Link } from "react-router-dom";

interface Props {
  search: (item: string) => void;
}

const { Search } = Input;
const { Title } = Typography;

export default function HomeHero({ search }: Props) {
  return (
    <div className="home-hero">
      <div className="home-hero__search">
        <Title className="home-hero__title" level={2}>
          Find awsome place to stay
        </Title>
        <Search
          placeholder="Search 'Duabi'"
          size="large"
          enterButton
          onSearch={(item) => search(item)}
        ></Search>
      </div>
      <Row gutter={12} justify="space-around" className="home-hero__cards">
        <Col md={5} xs={12}>
          <Link to="/listings/dubai">
            <Card
              hoverable
              className="home-hero__card"
              cover={<img src={dubaiImage} alt="dubai" />}
            >
              Dubai
            </Card>
          </Link>
        </Col>
        <Col md={5} xs={12}>
          <Link to="/listings/toronto">
            <Card
              hoverable
              className="home-hero__card"
              cover={<img src={torontoImage} alt="toronto" />}
            >
              Toronto
            </Card>
          </Link>
        </Col>
        <Col md={5} xs={0}>
          <Link to="/listings/london">
            <Card
              className="home-hero__card"
              hoverable
              cover={<img src={londonImage} alt="london" />}
            >
              London
            </Card>
          </Link>
        </Col>
        <Col md={5} xs={0}>
          <Link to="/listings/los%20angles">
            <Card
              className="home-hero__card"
              hoverable
              cover={<img src={LAImage} alt="los-angles" />}
            >
              Los Angles
            </Card>
          </Link>
        </Col>
      </Row>
    </div>
  );
}

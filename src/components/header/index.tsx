import { Input } from "antd";
import { Header } from "antd/lib/layout/layout";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { displayError } from "../../utils";
import { Viewer } from "../../utils/lib/types";
import { MenuItem } from "./components/menu-item";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Search } = Input;

export const AppHeader = ({ viewer, setViewer }: Props) => {
  const [search, setSearch] = useState("");
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname.includes("listings") &&
      location.pathname.split("/").length === 3
    ) {
      setSearch(location.pathname.split("/")[2]);
    } else setSearch("");
  }, [location]);

  const handleSearch = (value: string) => {
    const trimmedValue = value.toString().trim();
    if (trimmedValue) {
      setSearch(trimmedValue);
      history.push(`/listings/${trimmedValue}`);
    } else displayError("please enter valid search term");
  };

  return (
    <Header className="app-header">
      <div className="app-header__title">
        <Link to="/">
          <img className="app-header__logo" src={logo} alt="app logo" />{" "}
        </Link>
        <Search
          style={{ width: "20rem" }}
          placeholder="search for a place"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={handleSearch}
          enterButton
        />
      </div>
      <div className="app-header__menu">
        <MenuItem viewer={viewer} setViewer={setViewer} />
      </div>
    </Header>
  );
};

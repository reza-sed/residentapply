import { Header } from "antd/lib/layout/layout";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { Viewer } from "../../utils/lib/types";
import { MenuItem } from "./components/menu-item";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const AppHeader = ({ viewer, setViewer }: Props) => {
  return (
    <Header className="app-header">
      <div className="app-header__title">
        <Link to="/">
          <img className="app-header__logo" src={logo} alt="app logo" />{" "}
        </Link>
      </div>
      <div className="app-header__menu">
        <MenuItem viewer={viewer} setViewer={setViewer} />
      </div>
    </Header>
  );
};

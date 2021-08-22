import { Menu, Button } from "antd";
import {
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Viewer } from "../../../utils/lib/types";
import { useMutation } from "@apollo/react-hooks";
import { logout as LogOutData } from "../../../graphql/mutations/user/__generated__/logout";
import { LOGOUT } from "../../../graphql/mutations";
import { displayError, displaySuccess } from "../../../utils";

const { SubMenu } = Menu;
interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

export const MenuItem = ({ viewer, setViewer }: Props) => {
  const [logoutFn] = useMutation<LogOutData>(LOGOUT, {
    onCompleted: (data) => {
      if (data && data.logout) {
        setViewer(data.logout);
      }
      displaySuccess("Successfully signed out !");
    },

    onError: (data) => {
      displayError("Unable to signed you out");
    },
  });

  const handleLogout = () => {
    logoutFn();
  };

  const subMenuLogin =
    viewer && viewer.id ? (
      <SubMenu
        key="/profile"
        icon={<ProfileOutlined />}
        title={viewer.username}
      >
        <Menu.Item key="/user" icon={<UserOutlined />}>
          <Link to={`/user/${viewer.id}`}>User Profile</Link>
        </Menu.Item>
        <Menu.Item
          key="/logout"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </SubMenu>
    ) : (
      <Menu.Item key="/login">
        <Link to="/login">
          <Button type="primary">Sign In</Button>
        </Link>
      </Menu.Item>
    );

  return (
    <Menu mode="horizontal" selectable={true} className="menu">
      <Menu.Item key="/host" icon={<HomeOutlined />}>
        <Link to="/host">Host</Link>
      </Menu.Item>
      <Menu.Item key="force">{subMenuLogin}</Menu.Item>
    </Menu>
  );
};

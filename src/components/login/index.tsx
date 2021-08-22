import {
  Layout,
  Card,
  Typography,
  Input,
  Form,
  Button,
  Checkbox,
  Spin,
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import logo from "../../assets/logo.png";
import { Link, useHistory } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { LOGIN } from "../../graphql/mutations";
import {
  loginVariables,
  login as LoginData,
} from "../../graphql/mutations/user/__generated__/login";
import { Viewer } from "../../utils/lib/types";
import { displayError, displaySuccess } from "../../utils";
import ErrorElement from "../../utils/components/error";

const { Content } = Layout;
const { Title } = Typography;

interface Props {
  setViewer: (viewer: Viewer) => void;
}

export const Login = ({ setViewer }: Props) => {
  const history = useHistory();
  const [loginFn, { loading: loginLoading, error: loginError }] = useMutation<
    LoginData,
    loginVariables
  >(LOGIN, {
    onCompleted: (data) => {
      if (data && data.login) {
        setViewer(data.login);
      }
      displaySuccess("Successful Login!");
    },
  });

  const onFinish = async (loginInput: loginVariables) => {
    try {
      if (loginInput && loginInput.username) {
        await loginFn({ variables: loginInput });
        history.replace("/");
      }
    } catch (error) {
      console.log("error !!!", error);
      displayError(
        "Unfortunately, Unable to log you in, please try again later!"
      );
    }
  };

  if (loginLoading) {
    return (
      <Content className="login-spinner">
        <Spin size="large" tip="Logging in ..." />
      </Content>
    );
  }

  const loginErrorBanner = loginError ? (
    <ErrorElement description={loginError.message} />
  ) : null;

  return (
    <Content className="login">
      {loginErrorBanner}
      <Card className="login-card">
        <div className="login-card__intro">
          <Title level={3}>
            <span role="img" aria-label="wave">
              <img className="login-card__intro-icon" src={logo} alt=" logo" />
            </span>
          </Title>
          <Title level={3}>Welcome to RESAPPLY</Title>
        </div>
        <div>
          <Form
            name="normal_login"
            className="login-card__form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your Username!" },
              ]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your Password!" },
              ]}
            >
              <Input
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Link to="/forget" className="login-card__form-forgot">
                Forgot password
              </Link>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-card__form-button"
              >
                Log in
              </Button>
              <Link className="login-card__form-register" to="/signup">
                register now!
              </Link>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </Content>
  );
};

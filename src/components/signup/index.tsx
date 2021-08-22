import { Layout, Card, Typography, Input, Form, Button } from "antd";
import { RouteComponentProps } from "react-router-dom";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import logo from "../../assets/logo.png";
import { useMutation } from "@apollo/react-hooks";
import { REGISTER } from "../../graphql/mutations";
import { registerUserVariables } from "../../graphql/mutations/user/__generated__/registerUser";

const { Content } = Layout;
const { Title } = Typography;

export const Signup = ({ history }: RouteComponentProps) => {
  const [registerUserFn] = useMutation<boolean, registerUserVariables>(
    REGISTER
  );
  const onFinish = async (signupInput: registerUserVariables) => {
    try {
      if (signupInput) {
        await registerUserFn({ variables: signupInput });
        history.push("/login");
      }
    } catch (error) {}
  };

  return (
    <Content className="login">
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
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please input your Email!" }]}
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
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
            <Form.Item
              name="confirm"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Confirm password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-card__form-button"
              >
                Register
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </Content>
  );
};

import React, { Fragment } from "react";
import { User as UserData } from "../../../graphql/queries/user/__generated__/User";
import { Avatar, Card, Divider, Typography, Button } from "antd";

interface Props {
  user: UserData["user"];
  viewerIsUser: boolean;
}

const { Paragraph, Text, Title } = Typography;

export default function UserProfile({ user, viewerIsUser }: Props) {
  const connectAsHostElement = viewerIsUser ? (
    <Fragment>
      <Divider />
      <Title level={4}>Additional Detail</Title>
      <Paragraph>You could join REST APPLY as host!</Paragraph>
      <Button type="primary">Connect As Host</Button>
    </Fragment>
  ) : null;

  return (
    <div className="user-profile">
      <Card className="user-profile__card">
        <div className="user-profile__avatar">
          <Avatar size={100} src={user.avatar} />
        </div>
        <Divider />
        <div className="user-profile__detail">
          <Title level={4}>Details</Title>
          <Paragraph>
            Name: <Text strong>{user.username}</Text>
          </Paragraph>
          <Paragraph>
            Contact: <Text strong>{user.email}</Text>
          </Paragraph>
        </div>
        {connectAsHostElement}
      </Card>
    </div>
  );
}

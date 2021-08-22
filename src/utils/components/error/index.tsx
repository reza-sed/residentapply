import React from "react";
import { Alert } from "antd";

interface Props {
  message?: string;
  description?: string;
}

export default function ErrorElement({
  message = "something bad happened",
  description = "try again later",
}: Props) {
  return (
    <Alert
      className="error-element"
      banner
      closable
      message={message}
      description={description}
      type="error"
    />
  );
}

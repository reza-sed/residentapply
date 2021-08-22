import { message, notification } from "antd";

export const displaySuccess = (message: string, description?: string) => {
  return notification["success"]({
    message,
    description,
    placement: "bottomRight",
    style: {
      marginBottom: 20,
    },
  });
};

export const displayError = (error: string) => {
  return message.error(error);
};

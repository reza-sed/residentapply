import React, { FormEvent, useState } from "react";
import {
  Typography,
  Layout,
  Form,
  Input,
  InputNumber,
  Radio,
  Upload,
  Button,
} from "antd";
import { Viewer } from "../../utils/lib/types";
import { Link } from "react-router-dom";
import { ListingType } from "../../globalTypesFile";
import {
  ApartmentOutlined,
  BankOutlined,
  HomeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { displayError, displaySuccess } from "../../utils";
import { UploadChangeParam } from "antd/lib/upload";
import { useMutation } from "@apollo/react-hooks";
import { ADD_LISTING } from "../../graphql/mutations";
import {
  ADD_LISTING as ADD_LISTING_DATA,
  ADD_LISTINGVariables,
} from "../../graphql/mutations/listings/__generated__/ADD_LISTING";

const { Content } = Layout;
const { Text, Title } = Typography;

const dummyRequest = ({ file, onSuccess }: any) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const beforeUploadImage = (file: File) => {
  const fileIsValidImage =
    file.type === "image/jpeg" || file.type === "image/png";

  const fileValidSize = file.size / 1024 / 1024 <= 1;

  if (!fileIsValidImage)
    displayError("file should in valid formtat Jpeg or PNG");

  if (!fileValidSize) displayError("file should be valid size");

  return fileValidSize && fileIsValidImage;
};

const getBase64Image = (
  img: File | Blob,
  callback: (imageBase64Value: string) => void
) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.onload = () => {
    if (typeof reader.result === "string") callback(reader.result);
  };
};

interface Props {
  viewer: Viewer;
}

const { Item } = Form;

export const Host = ({ viewer }: Props) => {
  const [form] = Form.useForm();

  const [addListing, { loading: addListingLoading, error: addListingError }] =
    useMutation<ADD_LISTING_DATA, ADD_LISTINGVariables>(ADD_LISTING, {
      onError: () => {
        displayError("Something bad happened please try again later");
      },
      onCompleted: () => {
        displaySuccess("Your listing is successfully created");
      },
    });

  const [imageLoading, setImageLoading] = useState(false);
  const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);

  const handleSubmit = (evt: FormEvent) => {
    evt.preventDefault();

    const hasError =
      form.getFieldsError().filter((item) => item.errors.length > 0).length > 0;

    if (hasError) {
      displayError("Please complete all required fields");
      return;
    }

    const values = form.getFieldsValue();

    // send to remote server
    const fullAddress = `${values.address}, ${values.city}, ${values.state}, ${values.zipcode}`;

    console.log(imageBase64Value);

    const input = { ...values, address: fullAddress, image: imageBase64Value };
    delete input.city;
    delete input.state;
    delete input.zipcode;

    addListing({ variables: { input } });
  };

  const handleUpload = (info: UploadChangeParam) => {
    const { file } = info;

    if (file.status === "uploading") {
      return setImageLoading(true);
    }

    if (file.status === "done" && file.originFileObj) {
      console.log(file);
      getBase64Image(file.originFileObj, (imageBase64Value) => {
        setImageBase64Value(imageBase64Value);
        setImageLoading(false);
      });
    }
  };

  if (viewer && !viewer.username) {
    return (
      <Content className="add-host">
        <div>
          <Title level={3}>You have not account yet?!</Title>
          <Text type="secondary">
            For adding new listing you should first go to{" "}
            <Link to="/login">login page</Link>
          </Text>
        </div>
      </Content>
    );
  }

  if (addListingLoading) {
    return (
      <Content className="add-host">
        <div>
          <Title level={3}>Your listing is being created</Title>
          <Text type="secondary">please wait while we doing the job :)</Text>
        </div>
      </Content>
    );
  }

  return (
    <Content className="add-host">
      <div className="add-host__header">
        <Title level={3}>Here you can add your listing</Title>
        <Text type="secondary">
          please supply at least minimum amount of information, in the following
          form
        </Text>
      </div>
      <Form
        layout="vertical"
        form={form}
        onSubmitCapture={handleSubmit}
        labelCol={{
          lg: { span: 8, offset: 4 },
          sm: { span: 8, offset: 4 },
          xs: { span: 16, offset: 1 },
        }}
        wrapperCol={{
          lg: { span: 16, offset: 4 },
          sm: { span: 16, offset: 4 },
          xs: { span: 18, offset: 1 },
        }}
        autoComplete="off"
      >
        <Item
          label="Home Type"
          name="type"
          rules={[{ required: true, message: "Please select one home type" }]}
        >
          <Radio.Group>
            <Radio.Button value={ListingType.APARTMENT}>
              <ApartmentOutlined />
              &nbsp;
              <span>Apartment</span>
            </Radio.Button>
            <Radio.Button value={ListingType.HOUSE}>
              <HomeOutlined />
              &nbsp;
              <span>House</span>
            </Radio.Button>
            <Radio.Button value={ListingType.VILLA}>
              <BankOutlined />
              &nbsp;
              <span>Villa</span>
            </Radio.Button>
          </Radio.Group>
        </Item>
        <Item
          label="Title"
          name="title"
          extra="max character length 50"
          rules={[{ required: true }]}
        >
          <Input
            maxLength={50}
            placeholder="Shiny house with various windows"
          />
        </Item>
        <Item
          label="Description"
          name="description"
          extra="max character length 150"
          rules={[{ required: true }]}
        >
          <Input.TextArea
            maxLength={150}
            rows={3}
            placeholder="materialize the building ..."
          />
        </Item>
        <Item label="Address" name="address" rules={[{ required: true }]}>
          <Input placeholder="Hill County, 24 ave." />
        </Item>
        <Item label="City/Town" name="city" rules={[{ required: true }]}>
          <Input placeholder="Philadelphia" />
        </Item>
        <Item label="State/Province" name="state" rules={[{ required: true }]}>
          <Input placeholder="Pennsylvania" />
        </Item>
        <Item
          label="Zip/Postal code"
          name="zipcode"
          rules={[{ required: true }]}
        >
          <Input placeholder="Your Zip/Postal code" />
        </Item>
        <Item
          label="Image"
          name="image"
          extra="images should be under 1MB and jpeg/png"
          rules={[{ required: true }]}
        >
          <Upload
            name="upload-container"
            customRequest={dummyRequest}
            beforeUpload={beforeUploadImage}
            onChange={handleUpload}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Item>
        <Item
          label="Price"
          name="price"
          extra="all price are in Cent/day"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} placeholder="1200" />
        </Item>
        <Item
          label="Max number of Guests"
          name="numOfGuests"
          rules={[{ required: true, message: "Please enter number of guests" }]}
        >
          <InputNumber min={1} placeholder="3" />
        </Item>
        <Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Item>
      </Form>
    </Content>
  );
};

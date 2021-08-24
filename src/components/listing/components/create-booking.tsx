import { Button, Card, DatePicker, Divider, Typography } from "antd";
import moment, { Moment } from "moment";
import { displayError } from "../../../utils";

interface Props {
  price: number;
  checkInDate: Moment | null;
  checkOutDate: Moment | null;
  setCheckInDate: (checkInDate: Moment | null) => void;
  setCheckOutDate: (checkOutDate: Moment | null) => void;
}

const { Text, Title, Paragraph } = Typography;

export default function CreateBooking({
  price,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
}: Props) {
  const veifyCheckOutDate = (date: Moment | null) => {
    if (checkInDate && date && date > checkInDate) {
      setCheckOutDate(date);
    } else {
      displayError("selected checkout data must be after check in date");
    }
  };
  return (
    <div className="listing-booking">
      <Card>
        <div>
          <Paragraph>
            <Title level={2}>
              ${Math.round(price / 100)}
              <span style={{ color: "gray" }}>/day</span>
            </Title>
          </Paragraph>
          <Divider />
          <div>
            <Paragraph strong>Check In </Paragraph>
            <DatePicker
              value={checkInDate}
              disabledDate={(date) => date < moment()}
              onChange={(value) => setCheckInDate(value)}
              showToday={false}
              onOpenChange={() => setCheckOutDate(null)}
            />
          </div>
          <div>
            <Paragraph strong>Check Out </Paragraph>
            <DatePicker
              disabled={!checkInDate}
              value={checkOutDate}
              disabledDate={(date) => date < moment()}
              onChange={(value) => veifyCheckOutDate(value)}
              showToday={false}
            />
          </div>
        </div>
        <Divider />
        <Button
          disabled={!checkInDate || !checkOutDate}
          size="large"
          type="primary"
        >
          Book request
        </Button>
      </Card>
    </div>
  );
}

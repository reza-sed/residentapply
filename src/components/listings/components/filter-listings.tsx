import { ListingsFilter } from "../../../globalTypesFile";
import { Select } from "antd";

interface Props {
  filter: ListingsFilter;
  setFilter: (filter: ListingsFilter) => void;
}

const { Option } = Select;

export default function FilterListings({ filter, setFilter }: Props) {
  return (
    <div>
      <span>Filter By </span>
      <Select value={filter} onChange={setFilter}>
        <Option value={ListingsFilter.PRICE_LOW_TO_HIGH}>
          Price: Low to High
        </Option>
        <Option value={ListingsFilter.PRICE_HIGH_TO_LOW}>
          Price: High to Low
        </Option>
      </Select>
    </div>
  );
}

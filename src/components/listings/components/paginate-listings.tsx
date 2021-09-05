import { Pagination } from "antd";

interface Props {
  total: number;
  page: number;
  limit: number;
  setPage: (page: number) => void;
}

export default function PaginateListings({
  page,
  setPage,
  limit,
  total,
}: Props) {
  return (
    <Pagination
      current={page}
      defaultPageSize={limit}
      total={total}
      hideOnSinglePage
      showLessItems
      onChange={setPage}
    />
  );
}

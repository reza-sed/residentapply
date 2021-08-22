import { Fragment } from "react";
import { Skeleton } from "antd";

export const PageSkeleton = () => {
  const skeletonParagraph = <Skeleton active paragraph={{ rows: 4 }} />;

  return (
    <Fragment>
      {skeletonParagraph}
      {skeletonParagraph}
      {skeletonParagraph}
    </Fragment>
  );
};

import { Button } from "@axelarjs/ui";
import type { FC } from "react";

type PaginationProps = {
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
};

const Pagination: FC<PaginationProps> = ({
  page,
  onPageChange,
  hasNextPage,
  hasPrevPage,
}) => (
  <div>
    <div className="join flex items-center justify-center">
      <Button
        aria-label="previous page"
        $size="sm"
        disabled={!hasPrevPage}
        onClick={onPageChange.bind(null, page - 1)}
        className="join-item disabled:opacity-50"
      >
        «
      </Button>
      <Button $size="sm" className="join-item">
        Page {page + 1}
      </Button>
      <Button
        aria-label="next page"
        $size="sm"
        disabled={!hasNextPage}
        onClick={onPageChange.bind(null, page + 1)}
        className="join-item disabled:opacity-50"
      >
        »
      </Button>
    </div>
  </div>
);

export default Pagination;

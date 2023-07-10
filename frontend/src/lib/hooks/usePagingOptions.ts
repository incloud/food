import { useState } from 'react';

interface IPageInfo {
  endCursor?: string | null;
  startCursor?: string | null;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export const usePagingOptions = (pageSize = 10) => {
  const [pagingOptions, setPagingOptions] = useState<{
    before?: string | null;
    after?: string | null;
    first?: number;
    last?: number;
  }>({ first: pageSize });

  const gotoFirstPage = () => setPagingOptions({ first: pageSize });
  const gotoLastPage = () => setPagingOptions({ last: pageSize });

  const getNextPageClickHandler = (pageInfo?: IPageInfo) => () => {
    if (!pageInfo?.hasNextPage) {
      return;
    }

    setPagingOptions({
      first: pageSize,
      after: pageInfo?.endCursor,
    });
  };

  const getPreviousPageClickHandler = (pageInfo?: IPageInfo) => () => {
    if (!pageInfo?.hasPreviousPage) {
      return;
    }

    setPagingOptions({
      last: pageSize,
      before: pageInfo?.startCursor,
    });
  };

  return {
    pagingOptions,
    setPagingOptions,
    getNextPageClickHandler,
    getPreviousPageClickHandler,
    gotoFirstPage,
    gotoLastPage,
  };
};

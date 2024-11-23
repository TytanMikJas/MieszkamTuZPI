import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import ListLoader from './ListLoader';

export default function InfiniteList({
  children,
  loadMore,
  isMore,
  className,
}: {
  children: React.ReactNode;
  loadMore: () => void;
  isMore: boolean;
  className?: string;
}) {
  return (
    <InfiniteScroll
      className={className}
      loadMore={loadMore}
      hasMore={isMore}
      loader={<ListLoader />}
      useWindow={false}
    >
      {children}
    </InfiniteScroll>
  );
}

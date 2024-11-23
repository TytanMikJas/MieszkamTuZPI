import { useNavigate } from 'react-router-dom';
import InfiniteList from '../../../../reusable-components/containers/InfiniteList/InfiniteList';
import { ROUTES } from '../../../../core/routing/Router';
import { useListingStore } from '@/core/stores/listing-store';
import ListingCard from '@/reusable-components/cards/listing-card/ListingCard';

export default function ListingsList() {
  const navigate = useNavigate();
  const { listingsList, fetchListingsList, isMoreList } = useListingStore();

  const handleClick = (slug: string) => {
    navigate(ROUTES.MAP.LISTING.BY_NAME.path(slug));
  };

  return (
    <div className="flex flex-col w-full h-full items-center scrollable-vertical">
      <InfiniteList loadMore={fetchListingsList} isMore={isMoreList}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listingsList.map((listing, index) => (
            <ListingCard
              key={index}
              listing={listing}
              onClick={() => handleClick(listing.slug)}
            />
          ))}
        </div>
      </InfiniteList>
    </div>
  );
}

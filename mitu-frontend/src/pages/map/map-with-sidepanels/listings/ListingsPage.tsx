import ListingsList from './ListingsList';
import ListingSorting from './ListingSorting';
import { useEffect } from 'react';
import { useListingStore } from '@/core/stores/listing-store';

type Props = object;

export default function ListingsPage({}: Props) {
  const { resetList, setResetList } = useListingStore();
  useEffect(() => {
    if (!resetList) return;
    setResetList(false);
    window.location.reload();
  }, [resetList]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row justify-around p-3">
        <ListingSorting />
      </div>
      <ListingsList />
    </div>
  );
}

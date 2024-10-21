import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../core/routing/Router';
import AnnouncementCard from '@/reusable-components/cards/announcement-card/AnnouncementCard';
import { useAnnouncementStore } from '@/core/stores/announcement-store';
import InfiniteList from '@/reusable-components/containers/InfiniteList/InfiniteList';

export default function AnnouncementsList() {
  const navigate = useNavigate();
  const { announcementsList, fetchAnnouncementsList, isMoreList } =
    useAnnouncementStore();

  const handleClick = (slug: string) => {
    navigate(ROUTES.MAP.ANNOUNCEMENT.BY_NAME.path(slug));
  };

  return (
    <div className="flex flex-col w-full h-full items-center scrollable-vertical">
      <InfiniteList loadMore={fetchAnnouncementsList} isMore={isMoreList}>
        <div key="mainDiv" className="flex flex-col gap-4 px-4 py-2">
          {announcementsList.map((announcement, index) => (
            <AnnouncementCard
              key={index}
              announcement={announcement}
              onClick={() => handleClick(announcement.slug)}
            />
          ))}
        </div>
      </InfiniteList>
    </div>
  );
}

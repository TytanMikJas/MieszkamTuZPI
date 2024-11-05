import { useNavigate } from 'react-router-dom';
import InfiniteList from '../../../../reusable-components/containers/InfiniteList/InfiniteList';
import { ROUTES } from '../../../../core/routing/Router';
import { useAnnouncementStore } from '@/core/stores/announcement-store';
import AnnouncementCard from '@/reusable-components/cards/announcement-card/AnnouncementCard';

export default function AnnouncementsList() {
  const navigate = useNavigate();
  const {
    announcementsList,
    fetchAnnouncementsList,
    isMoreList,
    performVoteList,
    selectCardLoadingList,
  } = useAnnouncementStore();

  const handleClick = (slug: string) => {
    navigate(ROUTES.MAP.ANNOUNCEMENT.BY_NAME.path(slug));
  };

  return (
    <div className="flex flex-col w-full h-full items-center scrollable-vertical">
      <InfiniteList loadMore={fetchAnnouncementsList} isMore={isMoreList}>
        <div className="flex flex-col gap-4 px-4 py-2">
          {announcementsList.map((announcement, index) => (
            <AnnouncementCard
              key={index}
              announcement={announcement}
              performVoteList={performVoteList}
              selectCardLoadingList={selectCardLoadingList}
              onClick={() => handleClick(announcement.slug)}
            />
          ))}
        </div>
      </InfiniteList>
    </div>
  );
}

import AnnouncementDto from '@/core/api/announcement/dto/announcement';
import { commentCountParser, nounCountParser } from '../../../utils';
import UserInfo from '../../misc/user-info/UserInfo';
import Rating from '../../post-details/rating/Rating';
import TimeFromNow from '../../time/TimeFromNow';
import { PerformVote, SelectCardLoadingList } from '@/types';

export default function AnnouncementCard({
  announcement,
  performVoteList,
  selectCardLoadingList,
  onClick,
}: {
  announcement: AnnouncementDto;
  performVoteList: PerformVote;
  selectCardLoadingList: SelectCardLoadingList;
  onClick: () => void;
}) {
  const ratingLoading = selectCardLoadingList(`${announcement?.id}`);
  return (
    <div className="flex flex-col w-full border-2 gap-2 border-primary rounded-lg box-border px-2 py-2">
      <div className="flex flex-row items-center justify-between w-full">
        <UserInfo
          url={announcement.responsible}
          fullName={announcement.responsible}
          verified
        />
        <div>
          <Rating
            currentVote={announcement.personalRating}
            loading={ratingLoading}
            callback={performVoteList}
            postId={`${announcement.id}`}
            upvoteCount={announcement.upvoteCount}
            downvoteCount={announcement.downvoteCount}
          />
        </div>
      </div>
      <div
        className="font-bold hover:text-primary duration-1 ease-in cursor-pointer"
        onClick={onClick}
        data-testid="announcement-title"
      >
        {announcement.title}
      </div>
      <div className="line-clamp-2">{announcement.content}</div>
      <div className="flex flex-row justify-between text-gray-400">
        <TimeFromNow date={announcement.createdAt} />
        <div>
          {announcement?.comments &&
            `${announcement?.comments?.length} ${commentCountParser(announcement?.comments?.length)}`}
        </div>
      </div>
    </div>
  );
}

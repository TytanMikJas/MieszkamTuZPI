import VerifiedIcon from '@/reusable-components/icons/verified-icon/VerifiedIcon';
import Avatar from '@/reusable-components/misc/avatar/Avatar';

export default function UserInfo({
  url,
  fullName,
  verified = false,
}: {
  url: string;
  fullName: string;
  verified?: boolean;
}) {
  return (
    <div className="flex flex-row items-center gap-2 justify-center">
      <Avatar src={url} alt={''} />
      <div>{fullName}</div>
      {verified && <VerifiedIcon />}
    </div>
  );
}

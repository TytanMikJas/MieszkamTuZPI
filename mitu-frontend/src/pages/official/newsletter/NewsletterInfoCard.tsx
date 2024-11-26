import NewsletterInfoDto from '@/core/api/newsletter/newsletter-info-dto';
import { Card, CardContent, CardHeader } from '@/shadcn/card';

type Props = {
  newsletterInfo: NewsletterInfoDto;
  selected: boolean;
  onClick: () => void;
};

function NewsletterInfoCard({ newsletterInfo, selected, onClick }: Props) {
  return (
    <Card
      className={`m-5 cursor-pointer ${selected ? 'bg-gray-200' : ''}`}
      onClick={(e) => {
        if (e.stopPropagation) e.stopPropagation();
        if (!selected) {
          onClick();
        }
      }}
    >
      <CardHeader className="flex flex-row justify-start">
        <p className="text-2xl">#{newsletterInfo.id}</p>
      </CardHeader>
      <CardContent>
        <h1 className="text-2xl select-none">{newsletterInfo.name}</h1>
      </CardContent>
    </Card>
  );
}

export default NewsletterInfoCard;

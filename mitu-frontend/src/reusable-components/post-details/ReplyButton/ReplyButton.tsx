import { Button } from '../../../shadcn/button';

export default function ReplyButton({
  postId,
  postType,
  onClick,
}: {
  postId: number;
  postType: string;
  onClick: () => void;
}) {
  return (
    <Button onClick={onClick} variant={'link'} size="sm">
      <p className="text-sm color-gray-5000">Odpowiedz</p>
    </Button>
  );
}

import { Badge } from '@/shadcn/badge';
import { FileBadge } from '@/types';
import { X } from 'lucide-react';
import Truncate from '../misc/truncate/Truncate';
import { attachmentNameTruncateLogic } from '@/utils';

export default function AttachmentBadge({
  fileBadge,
  deselect,
}: {
  fileBadge: FileBadge;
  deselect: (fileName: string) => void;
}) {
  const handleDeselect = () => {
    deselect(fileBadge.fileName);
  };

  return (
    <Badge key={fileBadge.fileName} variant="secondary">
      <Truncate
        length={20}
        text={fileBadge.fileName}
        tooltip={true}
        truncateLogic={attachmentNameTruncateLogic}
      />

      <button
        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        onClick={handleDeselect}
      >
        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
      </button>
    </Badge>
  );
}

import { FilePaths } from '@/types';
import BorderLabel from '@/reusable-components/containers/border-label/BorderLabel';
import AttachmentDto from '@/core/api/common/attachment/AttachmentDto';
import { ATTACHMENTS_LABEL } from '@/strings';
import AttachmentCard from '@/reusable-components/cards/attachment-card/AttachmentCard';

export default function AttachmentsArea({
  attachments,
  filePaths,
}: {
  attachments: AttachmentDto[];
  filePaths: FilePaths;
}) {
  return (
    attachments.length > 0 && (
      <BorderLabel label={ATTACHMENTS_LABEL}>
        <div className="flex flex-wrap gap-2 justify-between">
          {attachments.map((attachment, index) => (
            <AttachmentCard
              filePaths={filePaths}
              key={index}
              attachment={attachment}
            />
          ))}
        </div>
      </BorderLabel>
    )
  );
}

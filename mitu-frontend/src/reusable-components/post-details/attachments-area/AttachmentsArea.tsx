import { FilePaths } from '@/types';
import { ATTACHMENTS_LABEL } from 'src/strings';
import AttachmentCard from 'src/reusable-components/cards/attachment-card/AttachmentCard';
import BorderLabel from 'src/reusable-components/containers/border-label/BorderLabel';
import AttachmentDto from '@/core/api/common/attachment/AttachmentDto';

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

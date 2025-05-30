import { MaterialSymbol } from 'react-material-symbols';
import Truncate from '@/reusable-components/misc/truncate/Truncate';
import { attachmentNameTruncateLogic } from '@/utils';
import { FilePaths, FileType } from '@/types';
import { FILES_URL } from '@/constants';
import AttachmentDto from '@/core/api/common/attachment/AttachmentDto';

export default function AttachmentCard({
  attachment,
  filePaths,
}: {
  attachment: AttachmentDto;
  filePaths: FilePaths;
}) {
  const attachmentIcon = (fileType: FileType) => {
    switch (fileType) {
      case 'IMAGE':
        return 'Image';
      case 'DOC':
        return 'Description';
      case 'TD':
        return 'deployed_code';
      default:
        return 'file';
    }
  };

  const filePath = `${FILES_URL}${filePaths[attachment.fileType]}${attachment.fileName}`;

  const handleOpen = () => {
    window.open(filePath);
  };

  return (
    <div
      onClick={handleOpen}
      className="flex w-min items-center flex-col cursor-pointer hover:bg-gray-100 p-1 rounded-lg"
    >
      {attachment.fileType === 'IMAGE' ? (
        <img
          src={filePath}
          alt={attachment.fileName}
          className="w-12 h-12 object-cover rounded"
        />
      ) : (
        <MaterialSymbol
          icon={attachmentIcon(attachment.fileType)}
          size={36}
          fill
          grade={-25}
          color="textdark"
        />
      )}
      <div className="text-xs text-black max-w-48 min-w-20 text-center">
        <Truncate
          truncateLogic={attachmentNameTruncateLogic}
          text={attachment.fileName}
          length={20}
          tooltip={true}
        />
      </div>
    </div>
  );
}

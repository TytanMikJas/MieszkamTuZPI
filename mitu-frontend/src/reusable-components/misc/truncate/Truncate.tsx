import { TruncateLogic } from '@/types';
import Tooltip from '../../tooltip/Tooltip';
import { defaultTruncateLogic } from '@/utils';

export default function Truncate({
  text,
  length = 100,
  tooltip = false,
  truncateLogic = defaultTruncateLogic,
}: {
  text: string;
  length?: number;
  tooltip?: boolean;
  truncateLogic?: TruncateLogic;
}) {
  const isTruncated = text.length > length;
  return (
    <div>
      <Tooltip text={text} visible={tooltip && isTruncated}>
        {isTruncated ? truncateLogic(text, length) : text}
      </Tooltip>
    </div>
  );
}

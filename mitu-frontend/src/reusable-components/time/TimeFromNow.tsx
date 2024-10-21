import { daysFromNow, formatDate } from '@/time-actions';
import Tooltip from '@/reusable-components/tooltip/Tooltip';

export default function TimeFromNow({ date }: { date: string }) {
  return (
    <Tooltip text={formatDate(date)} visible={true}>
      <div className="w-[fit-content]">{daysFromNow(date)}</div>
    </Tooltip>
  );
}

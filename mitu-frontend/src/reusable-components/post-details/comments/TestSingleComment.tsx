import { commentsWithSubcomments } from '../../../mock-data';
import CommentSection from './CommentSection';

export default function TestInvestmentDetails() {
  return (
    <div>
      <CommentSection commentsData={commentsWithSubcomments} />
    </div>
  );
}

import CommentsList from './CommentsList';
import OfficialButtons from './OfficialButtons';
import { Toaster } from 'sonner';

export default function OfficialPage() {
  return (
    <>
      <div className="flex w-full h-full">
        <div className="flex flex-col h-full w-3/4">
          <CommentsList />
        </div>
        <div className="flex h-full items-center m-4">
          <OfficialButtons />
        </div>
      </div>
    </>
  );
}

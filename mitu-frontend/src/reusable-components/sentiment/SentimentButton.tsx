import React from 'react';
import AiIcon from '../icons/ai-icon/AIIcon';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/shadcn/dialog';
import { Button } from '@/shadcn/button';
import Tooltip from '../tooltip/Tooltip';
import useSentiment from '@/core/hooks/useSentiment';
import SentimentAnalysisResultsComponent from './SentimentAnalysisResultsComponent';

type Props = {
  postId: number;
};

function SentimentButton({ postId }: Props) {
  const [open, setOpen] = React.useState(false);
  const { data, fetch, loading } = useSentiment(postId);
  return (
    <>
      <Tooltip
        text="Analiza AI sentymentu komentarzy usługi Azure Language "
        visible
      >
        <button
          onClick={() => {
            setOpen(true);
            fetch(postId);
          }}
          className="flex bg-white w-max flex-row items-center gap-1 h-9 border shadow-sm px-1 py-1.5 rounded-full ease-in duration-1"
        >
          <AiIcon width={24} height={24} />
          <p className="text-black text-xs">Sentyment</p>
        </button>
      </Tooltip>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent>
          <DialogTitle>Analiza sentymentu AI usługi Azure Language</DialogTitle>
          {loading && <DialogDescription>Analiza w toku...</DialogDescription>}
          {data && !loading && (
            <DialogDescription>
              <SentimentAnalysisResultsComponent data={data} />
            </DialogDescription>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SentimentButton;

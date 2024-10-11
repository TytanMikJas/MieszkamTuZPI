import { Progress } from '@/shadcn/progress';

export default function ProgressBar({ progress }: { progress: number }) {
  return <Progress value={progress} />;
}

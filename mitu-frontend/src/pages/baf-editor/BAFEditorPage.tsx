import { Toaster } from 'sonner';
import BAFCalculator from './Calculator';

export default function BafEditorPage() {
  return (
    <>
      <Toaster />
      <div className="flex h-full w-full">
        <BAFCalculator />
      </div>
    </>
  );
}

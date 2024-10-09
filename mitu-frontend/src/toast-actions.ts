import { toast } from 'sonner';

export function emitError(message: string) {
  toast.error(message);
}

export function emitSuccess(message: string) {
  toast.success(message);
}

export function emitInfo(message: string) {
  toast.info(message);
}

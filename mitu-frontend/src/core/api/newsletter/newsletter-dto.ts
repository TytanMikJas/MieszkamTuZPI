import { PRISMA_ID } from '@/core/types';
import { OutputData } from '@editorjs/editorjs';

export default interface NewsletterDto {
  id: PRISMA_ID;
  name: string;
  subject: string;
  htmlNewsletter?: string;
  edjsNewsletter?: string;
}

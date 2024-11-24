import { PRISMA_ID } from '@/core/types';
import { OutputData } from '@editorjs/editorjs';

export default interface ParsedNewsletterDto {
  id: PRISMA_ID;
  name: string;
  subject: string;
  htmlNewsletter?: string;
  edjsNewsletter?: OutputData;
}

import { OutputData } from '@editorjs/editorjs';

export default interface CreateNewsletterDto {
  name: string;
  subject: string;
  htmlNewsletter?: string;
  edjsNewsletter?: string;
}

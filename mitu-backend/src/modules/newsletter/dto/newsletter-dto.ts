import { PRISMA_ID } from 'src/types';

export default class NewsletterDto {
  id: PRISMA_ID;
  name: string;
  subject: string;
  htmlNewsletter?: string;
  edjsNewsletter?: string;
}

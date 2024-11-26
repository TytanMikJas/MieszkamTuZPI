import { PRISMA_ID } from '@/core/types';

export default interface NewsletterInfoDto {
  id: PRISMA_ID;
  name: string;
}

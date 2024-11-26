import { Injectable } from '@nestjs/common';
import { Newsletter, PrismaClient } from '@prisma/client';
import { PRISMA_ID } from 'src/types';

interface NewsletterWithoutIdWithOptionalFields {
  name: string;
  subject: string;
  htmlNewsletter?: string;
  edjsNewsletter?: string;
}

@Injectable()
export default class NewsletterRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findAll(): Promise<Newsletter[]> {
    return await this.prisma.newsletter.findMany();
  }

  async findById(id: PRISMA_ID): Promise<Newsletter | null> {
    return await this.prisma.newsletter.findUnique({
      where: {
        id,
      },
    });
  }

  async create(
    newsletter: NewsletterWithoutIdWithOptionalFields,
  ): Promise<Newsletter> {
    return await this.prisma.newsletter.create({
      data: newsletter,
    });
  }

  async update(
    id: PRISMA_ID,
    newsletter: Partial<Newsletter>,
  ): Promise<Newsletter> {
    return await this.prisma.newsletter.update({
      where: {
        id,
      },
      data: newsletter,
    });
  }

  async delete(id: PRISMA_ID): Promise<Newsletter> {
    return await this.prisma.newsletter.delete({
      where: {
        id,
      },
    });
  }
}

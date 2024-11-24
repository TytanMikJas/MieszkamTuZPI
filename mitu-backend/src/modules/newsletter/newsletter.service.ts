import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import NewsletterRepository from './newsletter.repository';
import NewsletterInfoDto from './dto/newsletter-info.dto';
import { PRISMA_ID } from 'src/types';
import NewsletterDto from './dto/newsletter-dto';
import CreateNewsletterDto from './dto/create-newsletter-dto.input';
import EditNewsletterInputDto from './dto/edit-newsletter-dto.input';
import UserService from '../user/user.service';
import { MailService } from '../mail/mail-sender.service';
import { SimpleBadRequest } from 'src/exceptions/simple-bad-request.exception';
import { SimpleNotFound } from 'src/exceptions/simple-not-found.exception';

@Injectable()
export default class NewsletterService {
  constructor(
    private readonly newsletterRepository: NewsletterRepository,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}
  private logger = new Logger(NewsletterService.name);
  async getAllNewsletterInfo(): Promise<NewsletterInfoDto[]> {
    return (await this.newsletterRepository.findAll())
      .map((newsletter) => ({
        id: newsletter.id,
        name: newsletter.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getNewsletter(id: PRISMA_ID): Promise<NewsletterDto> {
    const newsletter = await this.newsletterRepository.findById(id);
    if (!newsletter) {
      throw new NotFoundException('Newsletter nie został odnaleziony');
    }
    return {
      ...newsletter,
    };
  }

  async createNewsletter(
    newsletter: CreateNewsletterDto,
  ): Promise<NewsletterDto> {
    return await this.newsletterRepository.create(newsletter);
  }

  async editNewsletter(
    newsletter: EditNewsletterInputDto,
  ): Promise<NewsletterDto> {
    const _newsletter = await this.newsletterRepository.findById(newsletter.id);
    if (!_newsletter) {
      throw new NotFoundException('Newsletter nie został odnaleziony');
    }
    return await this.newsletterRepository.update(newsletter.id, newsletter);
  }

  async deleteNewsletter(id: PRISMA_ID): Promise<NewsletterDto> {
    const _newsletter = await this.newsletterRepository.findById(id);
    if (!_newsletter) {
      throw new NotFoundException('Newsletter nie został odnaleziony');
    }
    return await this.newsletterRepository.delete(id);
  }

  async sendNewsletter(id: PRISMA_ID): Promise<void> {
    const _newsletter = await this.newsletterRepository.findById(id);
    if (!_newsletter) {
      throw new SimpleNotFound('Newsletter nie został odnaleziony');
    }
    // Send newsletter
    this.logger.log(
      `Newsletter with id ${_newsletter.name}, name ${_newsletter.name} was sent`,
    );

    if (!_newsletter.htmlNewsletter) {
      throw new SimpleNotFound('Nie wysłano: newsletter jest pusty');
    }

    const users = await this.userService.getAllWithNewsletterAgreement();
    const usersEmails = users.map((user) => user.email);

    if (usersEmails.length === 0) {
      throw new SimpleBadRequest('Brak użytkowników do wysłania newslettera');
    }

    await this.mailService.sendHtmlMail(
      usersEmails,
      _newsletter.subject,
      _newsletter.htmlNewsletter,
    );
    this.logger.log(
      `Newsletter with id ${_newsletter.name}, name ${_newsletter.name} was sent to ${usersEmails.length} users`,
    );
  }
}

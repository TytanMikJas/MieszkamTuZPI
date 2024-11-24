import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { $Enums } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JWTAuthGuard } from '../auth/strategies/jwt.strategy';
import { RolesGuard } from '../auth/strategies/roles.guard';
import NewsletterService from './newsletter.service';
import NewsletterInfoDto from './dto/newsletter-info.dto';
import { PRISMA_ID } from 'src/types';
import { ParsePrismaID } from 'src/pipes/parse-prisma-id.pipe';
import NewsletterDto from './dto/newsletter-dto';
import CreateNewsletterInputDto from './dto/create-newsletter-dto.input';
import EditNewsletterInputDto from './dto/edit-newsletter-dto.input';
import { SuccessMessage } from 'src/decorators/success-message/success-message.decorator';

@Controller('newsletter')
@ApiTags('newsletter')
@Roles($Enums.UserRole.OFFICIAL, $Enums.UserRole.ADMIN)
@UseGuards(JWTAuthGuard, RolesGuard)
export default class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}
  @Get('/')
  async getAllNewsletterInfo(): Promise<NewsletterInfoDto[]> {
    return await this.newsletterService.getAllNewsletterInfo();
  }

  @Get('/:id')
  async getNewsletter(
    @Param('id', ParsePrismaID) id: PRISMA_ID,
  ): Promise<NewsletterDto> {
    return await this.newsletterService.getNewsletter(id);
  }

  @Put('/')
  @SuccessMessage('Newsletter został utworzony')
  async createNewsletter(
    @Body() newsletter: CreateNewsletterInputDto,
  ): Promise<NewsletterDto> {
    return await this.newsletterService.createNewsletter(newsletter);
  }

  @Patch('/')
  @SuccessMessage('Newsletter został zaktualizowany')
  async editNewsletter(
    @Body() newsletter: EditNewsletterInputDto,
  ): Promise<NewsletterDto> {
    return await this.newsletterService.editNewsletter(newsletter);
  }

  @Delete('/:id')
  @SuccessMessage('Newsletter został usunięty')
  async deleteNewsletter(
    @Param('id', ParsePrismaID) id: PRISMA_ID,
  ): Promise<NewsletterDto> {
    return await this.newsletterService.deleteNewsletter(id);
  }

  @Post('/send/:id')
  @SuccessMessage('Newsletter został wysłany')
  async sendNewsletter(
    @Param('id', ParsePrismaID) id: PRISMA_ID,
  ): Promise<void> {
    await this.newsletterService.sendNewsletter(id);
  }
}

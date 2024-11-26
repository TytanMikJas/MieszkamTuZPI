import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilehandlerService } from './filehandler.service';
import { FileInterceptor } from '@nestjs/platform-express';
import NewsletterImageSavedDto from './dto/newsletter-image-saved.dto';

@Controller('filehandler')
export default class FilehandlerController {
  constructor(private readonly filehandlerService: FilehandlerService) {}

  @Post('newsletter-image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFiles(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<NewsletterImageSavedDto> {
    return await this.filehandlerService.saveNewsletterImage(file);
  }
}

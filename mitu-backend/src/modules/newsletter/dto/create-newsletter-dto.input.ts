import { IsOptional, IsString } from 'class-validator';

export default class CreateNewsletterDto {
  @IsString({
    message: 'Nazwa newslettera nie jest poprawna',
  })
  name: string;
  @IsString({
    message: 'Temat newslettera nie jest poprawny',
  })
  subject: string;
  @IsString({
    message:
      'HTML newslettera nie jest poprawny. Skontaktuj się z pomocą techniczną.',
  })
  @IsOptional()
  htmlNewsletter?: string;
  @IsString({
    message:
      'EDJS newslettera nie jest poprawne. Skontaktuj się z pomocą techniczną.',
  })
  @IsOptional()
  edjsNewsletter?: string;
}

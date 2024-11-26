import {
  IsString,
  IsOptional,
  IsNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PRISMA_ID } from 'src/types';
export default class EditNewsletterInputDto {
  @IsNumber()
  id: PRISMA_ID;
  @IsString()
  @IsOptional()
  @MinLength(1, {
    message: 'Nazwa newslettera jest za krótka',
  })
  @MaxLength(255, {
    message: 'Nazwa newslettera jest za długa',
  })
  name?: string;
  @IsString()
  @MinLength(1, {
    message: 'Tytuł newslettera jest za krótki',
  })
  @MaxLength(255, {
    message: 'Tytuł newslettera jest za długi',
  })
  @IsOptional()
  subject?: string;
  @IsString({
    message:
      'HTML newslettera nie jest poprawne. Skontaktuj się z pomocą techniczną.',
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

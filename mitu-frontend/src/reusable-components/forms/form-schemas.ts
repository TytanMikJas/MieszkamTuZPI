import {
  MIN_LENGTH_ANNOUNCEMENT_TITLE,
  MAX_LENGTH_ANNOUNCEMENT_TITLE,
  MIN_LENGTH_ANNOUNCEMENT_CONTENT,
  MAX_LENGTH_ANNOUNCEMENT_CONTENT,
  MIN_LENGHT_ANNOUNCEMENT_RESPONSIBLE,
  MAX_LENGHT_ANNOUNCEMENT_RESPONSIBLE,
  MAX_LENGTH_LISTING_CONTENT,
  MAX_LENGTH_LISTING_TITLE,
  MIN_LENGTH_LISTING_CONTENT,
  MIN_LENGTH_LISTING_TITLE,
  MAX_LENGHT_INVESTMENT_RESPONSIBLE,
  MAX_LENGTH_INVESTMENT_CONTENT,
  MAX_LENGTH_INVESTMENT_TITLE,
  MIN_LENGHT_INVESTMENT_RESPONSIBLE,
  MIN_LENGTH_INVESTMENT_CONTENT,
  MIN_LENGTH_INVESTMENT_TITLE,
  MAX_LENGTH_APARTMENT_NR,
  MAX_LENGTH_BUILDING_NR,
  MAX_LENGTH_STREET,
  MIN_LENGTH_APARTMENT_NR,
  MIN_LENGTH_BUILDING_NR,
  MIN_LENGTH_STREET,
} from '@/max-lengths';
import { z } from 'zod';

const titleSchema = (minLength: number, maxLength: number) =>
  z
    .string()
    .min(minLength, { message: 'Tytuł jest wymagany' })
    .max(maxLength, {
      message: `Tytuł nie może być dłuższy niż ${maxLength} znaków.`,
    });

const descriptionSchema = (minLength: number, maxLength: number) =>
  z
    .string()
    .min(minLength, { message: 'Opis jest wymagany' })
    .max(maxLength, {
      message: `Opis nie może być dłuższy niż ${maxLength} znaków.`,
    });

const responsibleSchema = (minLength: number, maxLength: number) =>
  z
    .string()
    .min(minLength, { message: 'Odpowiedzialny jest wymagany' })
    .max(maxLength, {
      message: `Odpowiedzialny nie może być dłuższy niż ${maxLength} znaków.`,
    });

const streetSchema = z
  .string()
  .min(MIN_LENGTH_STREET, { message: 'Ulica jest wymagana' })
  .max(MAX_LENGTH_STREET, { message: 'Nie może być dłuższa niż 100 znaków.' })
  .nullable()
  .optional()
  .or(z.literal(''))
  .transform((val) => val ?? '');

const buildingNrSchema = z
  .string()
  .min(MIN_LENGTH_BUILDING_NR, { message: 'Numer domu jest wymagany' })
  .max(MAX_LENGTH_BUILDING_NR, {
    message: 'Nie może być dłuższy niż 10 znaków.',
  })
  .nullable()
  .optional()
  .or(z.literal(''))
  .transform((val) => val ?? '');

const apartmentNrSchema = z
  .string()
  .min(MIN_LENGTH_APARTMENT_NR)
  .max(MAX_LENGTH_APARTMENT_NR, {
    message: 'Nie może być dłuższy niż 10 znaków.',
  })
  .nullable()
  .optional()
  .or(z.literal(''))
  .transform((val) => val ?? '');

export const announcementFormSchema = z.object({
  title: titleSchema(
    MIN_LENGTH_ANNOUNCEMENT_TITLE,
    MAX_LENGTH_ANNOUNCEMENT_TITLE,
  ),
  description: descriptionSchema(
    MIN_LENGTH_ANNOUNCEMENT_CONTENT,
    MAX_LENGTH_ANNOUNCEMENT_CONTENT,
  ),
  category: z.string().min(1, { message: 'Kategoria jest wymagana' }),
  responsible: responsibleSchema(
    MIN_LENGHT_ANNOUNCEMENT_RESPONSIBLE,
    MAX_LENGHT_ANNOUNCEMENT_RESPONSIBLE,
  ),
  isCommentable: z.string(),
  street: streetSchema,
  buildingNr: buildingNrSchema,
  apartmentNr: apartmentNrSchema,
  thumbnail: z.any(),
  district: z.string().optional(),
});

export const listingFormSchema = z.object({
  title: titleSchema(MIN_LENGTH_LISTING_TITLE, MAX_LENGTH_LISTING_TITLE),
  description: descriptionSchema(
    MIN_LENGTH_LISTING_CONTENT,
    MAX_LENGTH_LISTING_CONTENT,
  ),
  responsible: responsibleSchema(3, 50),
  street: streetSchema,
  buildingNr: buildingNrSchema,
  apartmentNr: apartmentNrSchema,
  thumbnail: z.any(),
  price: z.string(),
  surface: z.string(),
  sell: z.string(),
});

export const investmentFormSchema = z.object({
  title: titleSchema(MIN_LENGTH_INVESTMENT_TITLE, MAX_LENGTH_INVESTMENT_TITLE),
  description: descriptionSchema(
    MIN_LENGTH_INVESTMENT_CONTENT,
    MAX_LENGTH_INVESTMENT_CONTENT,
  ),
  category: z.string().min(1, { message: 'Kategoria jest wymagana' }),
  responsible: responsibleSchema(
    MIN_LENGHT_INVESTMENT_RESPONSIBLE,
    MAX_LENGHT_INVESTMENT_RESPONSIBLE,
  ),
  isCommentable: z.string(),
  status: z
    .string()
    .min(1, { message: 'Status jest wymagany' })
    .max(20, { message: 'Status nie może być dłuższy niż 20 znaków.' }),
  street: streetSchema,
  buildingNr: buildingNrSchema,
  apartmentNr: apartmentNrSchema,
  thumbnail: z.any(),
  badges: z.array(z.object({ value: z.string() })).optional(),
  model: z.any().optional(),
});

export type InvestmentFormData = z.infer<typeof investmentFormSchema>;
export type ListingFormData = z.infer<typeof listingFormSchema>;
export type AnnouncementFormData = z.infer<typeof announcementFormSchema>;

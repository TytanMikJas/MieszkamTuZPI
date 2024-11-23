import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

/**
 * DTO for filtering investments
 * @property badges - The badges of the investment
 * @property categoryName - The category name of the investment
 * @example
 * ```ts
 * {
 * badges: ['badge1', 'badge2'],
 * categoryName: 'Investment category',
 * }
 * ```
 */
export class FilterInvestmentDto {
  @IsOptional()
  @Transform(({ value }) => {
    return value.split(',');
  })
  badges: string[];

  @IsOptional()
  @Transform(({ value }) => {
    return value.split(',');
  })
  categoryName: string;

  public get badgesWhere() {
    return this.badges
      ? {
          badges: {
            some: {
              name: {
                in: this.badges,
              },
            },
          },
        }
      : {};
  }

  public get categoryWhere() {
    return this.categoryName
      ? {
          investmentCategoryId: this.categoryName,
        }
      : {};
  }
}

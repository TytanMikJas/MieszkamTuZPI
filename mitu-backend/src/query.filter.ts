import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { InvalidInputException } from './exceptions/invalid-input.exception';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { PAGE_NUM_LIMIT } from './constants';
import { SimpleBadRequest } from './exceptions/simple-bad-request.exception';

// the same as in @prisma/client
enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

enum OrderBy {
  ID = 'id',
  CREATED_AT = 'createdAt',
  CREATED_BY = 'createdBy',
  UPVOTE_COUNT = 'upvoteCount',
  DOWNVOTE_COUNT = 'downvoteCount',
  COMMENT_COUNT = 'commentCount',
}

export enum Rule {
  /* eslint-disable */
  EQUALS = 'equals', // strings, numbers,
  IN = 'in', // strings, numbers,
  NOT_IN = 'notIn', // strings, numbers,
  NOT = 'not', // strings, numbers,
  LESS_THAN = 'lt', // strings, numbers, dates
  LESS_THAN_EQUAL = 'lte', // strings, numbers, dates
  GREATER_THAN = 'gt', // strings, numbers, dates
  GREATER_THAN_EQUAL = 'gte', // strings, numbers, dates
  CONTAINS = 'contains', // string
  STARTS_WITH = 'startsWith', // string
  /* eslint-enable */
}

const oneValueRules = [
  Rule.EQUALS,
  Rule.NOT,
  Rule.LESS_THAN,
  Rule.LESS_THAN_EQUAL,
  Rule.GREATER_THAN,
  Rule.GREATER_THAN_EQUAL,
  Rule.CONTAINS,
  Rule.STARTS_WITH,
];
const manyValuesRules = [Rule.IN, Rule.NOT_IN];

class FilterParser {
  public static toNumber(value: string, minimum: number, maximum: number = -1) {
    const parsed = Number.parseInt(value);
    if (Number.isNaN(parsed)) {
      return minimum;
    }
    if (maximum === -1) {
      return Math.max(parsed, minimum);
    }
    return Math.min(Math.max(parsed, minimum), maximum);
  }

  public static parseValue(value: string): number | string | Date {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      return this.toIfDate(value);
    }
    return parsed as number;
  }

  public static parseValues(value: string): string[] | number[] {
    const parsed = value.split(',').map((e) => Number(e));
    if (parsed.some((e) => Number.isNaN(e))) {
      return value.split(',') as string[];
    }
    return parsed as number[];
  }

  public static toIfDate(value: string): Date | string {
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) {
      return value;
    }
    // shift the date to the local timezone
    const shiftedDate = new Date(parsed);
    shiftedDate.setHours(
      shiftedDate.getHours() - shiftedDate.getTimezoneOffset() / 60,
    );
    return shiftedDate;
  }
}

class Filter {
  constructor(filterTxt: string) {
    const [field, rest] = filterTxt.split(/_(.*)/s) as [string, string];
    const [rule, rawValue] = rest.split('=') as [Rule, string];

    let value = undefined;
    if (oneValueRules.includes(rule)) {
      value = FilterParser.parseValue(rawValue);
    }
    if (manyValuesRules.includes(rule)) {
      value = FilterParser.parseValues(rawValue);
    }

    this.field = field;
    this.rule = rule as Rule;
    this.value = value;
  }

  public field: string;
  public rule: Rule;
  public value: string;
  public static readonly regex = new RegExp(
    `^[a-zA-Z0-9]+_((${Object.values(Rule).join('|')}))=[a-zA-Z0-9']+`,
  );
}

class LocationFilter {
  /**
   * @example
   * filterTxt = "N=52.2296756,E=21.0122287,S=52.2296756,W=21.0122287"
   * @param values
   */
  constructor(values: string[][]) {
    this.north = Number(values[0][1]);
    this.east = Number(values[1][1]);
    this.south = Number(values[2][1]);
    this.west = Number(values[3][1]);
  }

  public north: number;
  public east: number;
  public south: number;
  public west: number;
}

export class GenericFilter {
  @ApiProperty({
    description: 'Page number',
    example: 0,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => FilterParser.toNumber(value, 0))
  @IsNumber({}, { message: ' "page" atrribute should be a number' })
  public page?: number = 0;

  @ApiProperty({
    description: 'Page size',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => FilterParser.toNumber(value, 1, PAGE_NUM_LIMIT))
  @IsNumber({}, { message: ' "pageSize" attribute should be a number ' })
  public pageSize?: number = 1;

  @ApiProperty({
    description: 'Order by post specialization (like investment) attribute',
    example: 'id',
    required: false,
  })
  @IsOptional()
  public orderByType?: string;

  @ApiProperty({
    description: 'Order by post attribute',
    example: OrderBy.UPVOTE_COUNT,
    required: false,
    enum: OrderBy,
  })
  @IsEnum(OrderBy)
  @IsOptional()
  public orderBy?: OrderBy = null;

  @ApiProperty({
    description: 'Sort order',
    example: SortOrder.ASC,
    required: false,
    enum: SortOrder,
  })
  @IsEnum(SortOrder)
  @IsOptional()
  public sortOrder? = SortOrder.ASC;

  // show available options
  @ApiProperty({
    description: `Filter that has to match the pattern: field_rule=value\n\nAvailable rules: **${Object.values(
      Rule,
    ).join(', ')}**`,
    example: 'id_equals=1',
    type: String,
    pattern: Filter.regex.source,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value.match(Filter.regex)) {
      throw new InvalidInputException(
        `Filter doesn\'t match the regex: ${Filter.regex}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return new Filter(value);
  })
  public filter?: Filter;

  @ApiProperty({
    description: `Filter that has to match the pattern: N=number,E=number,S=number,W=number`,
    example: 'N=52.2296756,E=21.0122287,S=52.2296756,W=21.0122287',
    type: String,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    const values = value
      .split(',')
      .map((direction: string) => direction.split('='));
    if (
      values.length !== 4 ||
      values[0][0] !== 'N' ||
      values[1][0] !== 'E' ||
      values[2][0] !== 'S' ||
      values[3][0] !== 'W'
    ) {
      throw new SimpleBadRequest(
        `Location filter doesn't match the pattern: location=N=number,E=number,S=number,W=number`,
      );
    }
    return new LocationFilter(values);
  })
  public location?: LocationFilter;

  /*
   * post locationX and locationY should be inside the location filter
   */
  public get whereLocation() {
    if (!this.location) return {};
    return {
      locationX: {
        lte: this.location.north,
        gte: this.location.south,
      },
      locationY: {
        lte: this.location.east,
        gte: this.location.west,
      },
    };
  }

  private paginationOn: boolean = true;
  public set pagination(value: boolean) {
    this.paginationOn = value;
  }

  public get orderBySpecialization() {
    const sortingOptions: any = [{ [OrderBy.ID]: SortOrder.DESC }];
    if (this.orderByType) {
      sortingOptions.unshift({ [this.orderByType]: this.sortOrder });
    }
    return sortingOptions;
  }

  public get orderByPost() {
    const sortingOptions: any = [{ [OrderBy.ID]: SortOrder.DESC }];
    if (this.orderBy) {
      sortingOptions.unshift({ [this.orderBy]: this.sortOrder });
    }
    return sortingOptions;
  }

  public get skip() {
    if (this.paginationOn == false) return 0;
    return this.page * this.pageSize;
  }

  public get take() {
    if (this.paginationOn == false) return 1000;
    return this.pageSize;
  }

  public get where() {
    if (!this.filter) return {};
    return {
      [this.filter.field]: {
        [this.filter.rule]: this.filter.value,
      },
    };
  }

  public get preview() {
    return JSON.stringify({
      filter: {
        skip: this.skip,
        take: this.take,
        order: this.orderBySpecialization,
      },
    });
  }
}

export const exportedForTesting = {
  SortOrder,
  Rule,
  oneValueRules,
  manyValuesRules,
  FilterParser,
  Filter,
};

import {
  HECTARE_SHORTENING,
  INVESTMENT_STATUS_LABEL_APPROVED,
  INVESTMENT_STATUS_LABEL_COMPLETED,
  INVESTMENT_STATUS_LABEL_IN_PROGRESS,
  INVESTMENT_STATUS_LABEL_PENDING,
  INVESTMENT_STATUS_LABEL_REJECTED,
  INVESTMENT_STATUS_NAME_APPROVED,
  INVESTMENT_STATUS_NAME_COMPLETED,
  INVESTMENT_STATUS_NAME_IN_PROGRESS,
  INVESTMENT_STATUS_NAME_PENDING,
  INVESTMENT_STATUS_NAME_REJECTED,
  LOCATION_NOT_SPECIFIED,
  SQUARE_METERS_SHORTENING,
} from '@/strings';

export function mapInvestmentStatusToLabel(statusName: string): string {
  switch (statusName) {
    case INVESTMENT_STATUS_NAME_PENDING:
      return INVESTMENT_STATUS_LABEL_PENDING;
    case INVESTMENT_STATUS_NAME_IN_PROGRESS:
      return INVESTMENT_STATUS_LABEL_IN_PROGRESS;
    case INVESTMENT_STATUS_NAME_COMPLETED:
      return INVESTMENT_STATUS_LABEL_COMPLETED;
    case INVESTMENT_STATUS_NAME_APPROVED:
      return INVESTMENT_STATUS_LABEL_APPROVED;
    case INVESTMENT_STATUS_NAME_REJECTED:
      return INVESTMENT_STATUS_LABEL_REJECTED;
    default:
      throw new Error('Invalid investment status name');
  }
}

export function transformSurface(surface: number): string {
  if (surface >= 10000) {
    return `${(surface / 10000).toFixed(2)} ${HECTARE_SHORTENING}`;
  } else {
    return `${surface} ${SQUARE_METERS_SHORTENING}`;
  }
}

export function buildAddress(
  street?: string,
  buildingNr?: string,
  apartmentNr?: string,
): string {
  if (!street && !buildingNr && !apartmentNr) {
    return LOCATION_NOT_SPECIFIED;
  }
  if (street && !buildingNr && !apartmentNr) {
    return street;
  }
  if (street && buildingNr && !apartmentNr) {
    return `${street} ${buildingNr}`;
  }
  if (street && buildingNr && apartmentNr) {
    return `${street} ${buildingNr}/${apartmentNr}`;
  }
  return LOCATION_NOT_SPECIFIED;
}

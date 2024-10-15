import {
  DOC_INVESTMENT_QUANTITY_LIMIT,
  IMAGE_INVESTMENT_QUANTITY_LIMIT,
  TD_INVESTMENT_QUANTITY_LIMIT,
} from 'src/constants';
import { IFiledetailsStrategy } from './i.filedetails.strategy';

/**
 * Strategy for Investment file details.
 */
export class InvestmentFiledetails implements IFiledetailsStrategy {
  getQuantityLimit_tds(): number {
    return TD_INVESTMENT_QUANTITY_LIMIT;
  }

  getQuantityLimit_images(): number {
    return IMAGE_INVESTMENT_QUANTITY_LIMIT;
  }

  getQuantityLimit_docs(): number {
    return DOC_INVESTMENT_QUANTITY_LIMIT;
  }
}

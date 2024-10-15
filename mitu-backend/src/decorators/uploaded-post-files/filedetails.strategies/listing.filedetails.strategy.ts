import {
  DOC_LISTING_QUANTITY_LIMIT,
  IMAGE_LISTING_QUANTITY_LIMIT,
  TD_LISTING_QUANTITY_LIMIT,
} from 'src/constants';
import { IFiledetailsStrategy } from './i.filedetails.strategy';

/**
 * Strategy for Listing file details.
 */
export class ListingFiledetails implements IFiledetailsStrategy {
  getQuantityLimit_tds(): number {
    return TD_LISTING_QUANTITY_LIMIT;
  }

  getQuantityLimit_images(): number {
    return IMAGE_LISTING_QUANTITY_LIMIT;
  }

  getQuantityLimit_docs(): number {
    return DOC_LISTING_QUANTITY_LIMIT;
  }
}

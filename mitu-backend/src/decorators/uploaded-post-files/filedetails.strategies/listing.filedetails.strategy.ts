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
  /**
   * Get quantity limit for TD files.
   * @returns Quantity limit for TD files.
   */
  getQuantityLimit_tds(): number {
    return TD_LISTING_QUANTITY_LIMIT;
  }

  /**
   * Get quantity limit for image files.
   * @returns Quantity limit for image files.
   */
  getQuantityLimit_images(): number {
    return IMAGE_LISTING_QUANTITY_LIMIT;
  }

  /**
   * Get quantity limit for DOC files.
   * @returns Quantity limit for DOC files.
   */
  getQuantityLimit_docs(): number {
    return DOC_LISTING_QUANTITY_LIMIT;
  }
}

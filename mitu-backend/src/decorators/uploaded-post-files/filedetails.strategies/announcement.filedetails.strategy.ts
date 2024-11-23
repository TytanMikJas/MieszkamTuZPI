import {
  DOC_ANNOUNCEMENT_QUANTITY_LIMIT,
  IMAGE_ANNOUNCEMENT_QUANTITY_LIMIT,
  TD_ANNOUNCEMENT_QUANTITY_LIMIT,
} from 'src/constants';
import { IFiledetailsStrategy } from './i.filedetails.strategy';

/**
 * Strategy for Announcement file details.
 */
export class AnnouncementFiledetails implements IFiledetailsStrategy {
  /**
   * Get quantity limit for TD files.
   * @returns Quantity limit for TD files.
   */
  getQuantityLimit_tds(): number {
    return TD_ANNOUNCEMENT_QUANTITY_LIMIT;
  }

  /**
   * Get quantity limit for image files.
   * @returns Quantity limit for image files.
   */
  getQuantityLimit_images(): number {
    return IMAGE_ANNOUNCEMENT_QUANTITY_LIMIT;
  }

  /**
   * Get quantity limit for DOC files.
   * @returns Quantity limit for DOC files.
   */
  getQuantityLimit_docs(): number {
    return DOC_ANNOUNCEMENT_QUANTITY_LIMIT;
  }
}

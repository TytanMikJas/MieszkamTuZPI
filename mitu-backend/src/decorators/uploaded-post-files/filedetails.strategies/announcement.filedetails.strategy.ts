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
  getQuantityLimit_tds(): number {
    return TD_ANNOUNCEMENT_QUANTITY_LIMIT;
  }

  getQuantityLimit_images(): number {
    return IMAGE_ANNOUNCEMENT_QUANTITY_LIMIT;
  }

  getQuantityLimit_docs(): number {
    return DOC_ANNOUNCEMENT_QUANTITY_LIMIT;
  }
}

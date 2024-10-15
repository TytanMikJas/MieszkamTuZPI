import {
  DOC_COMMENT_QUANTITY_LIMIT,
  IMAGE_COMMENT_QUANTITY_LIMIT,
  TD_COMMENT_QUANTITY_LIMIT,
} from 'src/constants';
import { IFiledetailsStrategy } from './i.filedetails.strategy';

/**
 * Strategy for Comment file details.
 */
export class CommentFiledetails implements IFiledetailsStrategy {
  getQuantityLimit_tds(): number {
    return TD_COMMENT_QUANTITY_LIMIT;
  }

  getQuantityLimit_images(): number {
    return IMAGE_COMMENT_QUANTITY_LIMIT;
  }

  getQuantityLimit_docs(): number {
    return DOC_COMMENT_QUANTITY_LIMIT;
  }
}

import { $Enums } from '@prisma/client';
import { AnnouncementFiledetails } from 'src/decorators/uploaded-post-files/filedetails.strategies/announcement.filedetails.strategy';
import { CommentFiledetails } from 'src/decorators/uploaded-post-files/filedetails.strategies/comment.filedetails.strategy';
import { IFiledetailsStrategy } from 'src/decorators/uploaded-post-files/filedetails.strategies/i.filedetails.strategy';
import { InvestmentFiledetails } from 'src/decorators/uploaded-post-files/filedetails.strategies/investment.filedetails.strategy';
import { ListingFiledetails } from 'src/decorators/uploaded-post-files/filedetails.strategies/listing.filedetails.strategy';
import { SimpleBadRequest } from 'src/exceptions/simple-bad-request.exception';
import { ERROR_INVALID_POST_TYPE } from 'src/strings';

/**
 * File details strategy factory
 * @export
 * @param {Enums.PostType} type
 * @returns {IFiledetailsStrategy}
 */
export function FiledetailsStrategyFactory(
  type: $Enums.PostType,
): IFiledetailsStrategy {
  switch (type) {
    case $Enums.PostType.ANNOUNCEMENT:
      return new AnnouncementFiledetails();
    case $Enums.PostType.INVESTMENT:
      return new InvestmentFiledetails();
    case $Enums.PostType.LISTING:
      return new ListingFiledetails();
    case $Enums.PostType.COMMENT:
      return new CommentFiledetails();
    default:
      throw new SimpleBadRequest(ERROR_INVALID_POST_TYPE);
  }
}

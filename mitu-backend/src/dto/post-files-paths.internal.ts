import { ApiProperty } from '@nestjs/swagger';
import { FILE_PATHS_DOC, FILE_PATHS_IMAGE, FILE_PATHS_TD } from 'src/strings';

/**
 * Post files paths
 * @export
 * @class PostFilesPaths
 */
export class PostFilesPaths {
  @ApiProperty()
  [FILE_PATHS_IMAGE]: Array<string>;
  @ApiProperty()
  [FILE_PATHS_TD]: Array<string>;
  @ApiProperty()
  [FILE_PATHS_DOC]: Array<string>;
}

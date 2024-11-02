import { ICompressionStrategy } from './i.compression.strategy';

/**
 * Strategy, that does not compress the file.
 */
export class NoCompressionStrategy implements ICompressionStrategy {
  /**
   * Compress the file.
   * @param {Express.Multer.File} file
   * @returns {Promise<Express.Multer.File>}
   */
  async compress(file: Express.Multer.File) {
    return Promise.resolve(file);
  }
}

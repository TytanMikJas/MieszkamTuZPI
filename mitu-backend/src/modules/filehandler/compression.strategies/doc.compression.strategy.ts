import { ICompressionStrategy } from './i.compression.strategy';

/**
 * Strategy, that does not compress the file.
 */
export class NoCompressionStrategy implements ICompressionStrategy {
  async compress(file: Express.Multer.File) {
    return Promise.resolve(file);
  }
}

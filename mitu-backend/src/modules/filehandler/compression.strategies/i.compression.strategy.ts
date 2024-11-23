/**
 * Interface for file compression strategies
 */
export interface ICompressionStrategy {
  /**
   * Compresses the given file
   * @param file Multer file to be compressed
   * @returns Promise of compressed multer file
   */
  compress(file: Express.Multer.File): Promise<Express.Multer.File>;
}

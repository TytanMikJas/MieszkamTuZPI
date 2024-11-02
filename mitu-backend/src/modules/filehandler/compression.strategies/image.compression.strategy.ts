import { DesiredImageFormat, FileExtensionRegExp } from 'src/types';
import { ICompressionStrategy } from './i.compression.strategy';
import sharp from 'sharp';

/**
 * Strategy for compressing images.
 */
export class ImageCompressionStrategy implements ICompressionStrategy {
  /**
   * Compress the image.
   * @param {Express.Multer.File} file
   * @returns {Promise<Express.Multer.File>}
   */
  async compress(file: Express.Multer.File): Promise<Express.Multer.File> {
    const compressedFile = sharp(file.buffer).png({ quality: 50 });
    file.buffer = await compressedFile.toBuffer();

    file.originalname = file.originalname.replace(
      FileExtensionRegExp,
      DesiredImageFormat,
    );

    return file;
  }
}

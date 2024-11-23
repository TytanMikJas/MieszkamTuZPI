import { ICompressionStrategy } from './i.compression.strategy';
import * as gltfPipeline from 'gltf-pipeline';

/**
 * Strategy for compressing GLTF files.
 */
export class GLTFCompressionStrategy implements ICompressionStrategy {
  /**
   * Compress the GLTF file.
   * @param {Express.Multer.File} file
   * @returns {Promise<Express.Multer.File>}
   */
  async compress(file: Express.Multer.File): Promise<Express.Multer.File> {
    return await gltfPipeline
      .processGltf(file.buffer, {
        dracoOptions: { compressionLevel: 10 },
      })
      .then((cf) => {
        file.buffer = cf.gltf;
        return file;
      });
  }
}

import { ICompressionStrategy } from './i.compression.strategy';
import * as gltfPipeline from 'gltf-pipeline';

/**
 * Strategy for compressing GLTF files.
 */
export class GLTFCompressionStrategy implements ICompressionStrategy {
  async compress(file: Express.Multer.File): Promise<Express.Multer.File> {
    //we are 100% sure that we get a GLTF file
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

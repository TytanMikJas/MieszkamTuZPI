import ImageTool from '@editorjs/image';
import uploader from '@ajite/editorjs-image-base64';
export class Base64ImageTool extends ImageTool {
  // Override constructor or methods to change behavior
  constructor(data, config, api, readOnly) {
    super(data, config, api, readOnly);
    this.config.uploader = uploader;
  }
}

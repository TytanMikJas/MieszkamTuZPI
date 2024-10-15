/**
 * Interface for the FileDetails Strategy, which specifies details for verification of uploaded files.
 */
export interface IFiledetailsStrategy {
  /**
   * Returns the quantity limit for 3D files for given strategy.
   */
  getQuantityLimit_tds(): number;
  /**
   * Returns the quantity limit for image files for given strategy.
   */
  getQuantityLimit_images(): number;
  /**
   * Returns the quantity limit for document files for given strategy.
   */
  getQuantityLimit_docs(): number;
}

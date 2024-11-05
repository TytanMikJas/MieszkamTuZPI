/**
 * Output DTO for GetParcelShape
 * @export
 * @class GetParcelShapeOutputDto
 * @param {number[][]} coords
 * @param {number[]} polygon_center
 * @param {number[]} max_bounds
 * @param {string} parcelRegion
 * @param {string} parcelNumber
 */
export class GetParcelShapeOutputDto {
  coords: number[][];

  polygon_center: number[];

  max_bounds: number[];

  parcelRegion?: string;

  parcelNumber?: string;
}

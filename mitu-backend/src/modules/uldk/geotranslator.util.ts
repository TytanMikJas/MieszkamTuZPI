import { ParcelCoordinatesInternalOutputDto } from './dto/parcel-coordinates.internal.output';

/**
 * Transform coordinates
 * @param x The x coordinate
 * @param y The y coordinate
 * @param transform The transform object
 * @returns {ParcelCoordinatesInternalOutputDto}
 */
export function transformCoordinates(
  x: string,
  y: string,
  transform: any,
): ParcelCoordinatesInternalOutputDto {
  const parsed_x = parseFloat(x.toString());
  const parsed_y = parseFloat(y.toString());
  const [_x, _y] = transform.forward([parsed_y, parsed_x]);
  return { x: _x.toString(), y: _y.toString() };
}

/**
 * Calculate polygon center
 * @param coordinates The coordinates
 * @returns {number[]}
 */
export function calculatePolygonCenter(coordinates: number[][]): number[] {
  const totalPoints = coordinates.length;

  let sumX = 0;
  let sumY = 0;

  for (const [x, y] of coordinates) {
    sumX += x;
    sumY += y;
  }

  const avgX = sumX / totalPoints;
  const avgY = sumY / totalPoints;

  return [avgY, avgX];
}

/**
 * Calculate polygon bounds
 * @param coordinates The coordinates
 * @returns {number[]}
 */
export function calculatePolygonBounds(coordinates: number[][]): number[] {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const [y, x] of coordinates) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  const reductionX = (maxX - minX) * 0.2;
  const reductionY = (maxY - minY) * 0.2;

  minX += reductionX;
  minY += reductionY;
  maxX -= reductionX;
  maxY -= reductionY;

  return [minX, minY, maxX, maxY];
}

export class GetParcelShapeOutputDto {
  coords: number[][];

  polygon_center: number[];

  max_bounds: number[];

  parcelRegion?: string;

  parcelNumber?: string;
}

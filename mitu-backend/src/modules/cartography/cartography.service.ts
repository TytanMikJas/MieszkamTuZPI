import { Injectable } from '@nestjs/common';
import { GetParcelInputDto } from './dto/get-parcel.input';
import { GetParcelOutputDto } from './dto/get-parcel.output';
import { ULDKService } from 'src/modules/uldk/uldk.service';
import { ParcelNotFound } from './cartography.strings';
import { GetParcelShapeInputDto } from './dto/get-parcel-shape.input';
import { GetParcelShapeOutputDto } from './dto/get-parcel-shape.output';
import { GetCoordsByAddressInputDto } from './dto/get-coords-by-address.input';
import { GetCoordsByAddressOutputDto } from './dto/get-coords-by-address.output';

/**
 * Cartography service
 * @export
 * @class CartographyService
 * @param {ULDKService} uldkProvider
 * @method {getParcelByCoordinates} getParcelByCoordinates
 * @method {getParcelShape} getParcelShape
 * @method {getCoordinatesByAddress} getCoordinatesByAddress
 */
@Injectable()
export class CartographyService {
  constructor(private uldkProvider: ULDKService) {}

  /**
   * Get parcel by coordinates
   * @param {GetParcelInputDto} getParcelInput
   * @returns {Promise<GetParcelOutputDto>}
   */
  async getParcelByCoordinates(
    getParcelInput: GetParcelInputDto,
  ): Promise<GetParcelOutputDto> {
    const { latitude, longitude } = getParcelInput;

    const { x, y } = this.uldkProvider.epsg4326epsg2180(longitude, latitude);
    const { parcelNumber, parcelRegion } =
      await this.uldkProvider.getParcelData(x, y);

    if (parcelNumber == '-1') throw new Error(ParcelNotFound);

    return { parcelNumber, parcelRegion, x, y };
  }

  /**
   * Get parcel shape
   * @param {GetParcelShapeInputDto} getParcelShapeInput
   * @returns {Promise<GetParcelShapeOutputDto>}
   */
  async getParcelShape(
    getParcelShapeInput: GetParcelShapeInputDto,
  ): Promise<GetParcelShapeOutputDto> {
    const { parcelNumber, parcelRegion, latitude, longitude } =
      getParcelShapeInput;

    const byName = parcelNumber && parcelRegion;
    const byCoordinates = latitude && longitude;

    if (!byName && !byCoordinates) throw new Error(ParcelNotFound);

    const uldkResult = byName
      ? await this.uldkProvider.getParcelWKTbyName(parcelNumber, parcelRegion)
      : await this.uldkProvider.getParcelWKT(longitude, latitude);

    if (uldkResult.parcelWKT == '-1') throw new Error(ParcelNotFound);

    const { parcelWKT } = uldkResult;

    const splitted = parcelWKT.split('((')[1].split('))')[0].split(',');

    const parsed: number[][] = [];
    splitted.forEach((coord: string) => {
      const [lng, lat] = coord.split(' ');
      const { x, y } = this.uldkProvider.epsg2180epsg4326(lat, lng); //reverse (that's just how it works)
      parsed.push([parseFloat(y), parseFloat(x)]);
    });

    const polygon_center = this.uldkProvider.calculatePolygonCenter(parsed);
    const max_bounds = this.uldkProvider.calculatePolygonBounds(parsed);

    return {
      coords: parsed,
      polygon_center,
      max_bounds,
      parcelNumber,
      parcelRegion,
    };
  }

  /**
   * Get coordinates by address
   * @param {GetCoordsByAddressInputDto} getCoordsByAddressInput
   * @returns {Promise<GetCoordsByAddressOutputDto>}
   */
  async getCoordinatesByAddress(
    getCoordsByAddressInput: GetCoordsByAddressInputDto,
  ): Promise<GetCoordsByAddressOutputDto> {
    const { address } = getCoordsByAddressInput;
    return await this.uldkProvider.getCoordinatesByAddress(address);
  }
}

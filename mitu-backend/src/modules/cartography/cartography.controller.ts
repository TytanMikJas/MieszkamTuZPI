import { Controller, Get, Query } from '@nestjs/common';
import { CartographyService } from './cartography.service';
import { GetParcelOutputDto } from './dto/get-parcel.output';
import { GetParcelInputDto } from './dto/get-parcel.input';
import { GetParcelShapeInputDto } from './dto/get-parcel-shape.input';
import { GetParcelShapeOutputDto } from './dto/get-parcel-shape.output';
import { GetCoordsByAddressInputDto } from './dto/get-coords-by-address.input';
import { GetCoordsByAddressOutputDto } from './dto/get-coords-by-address.output';
import { ApiTags } from '@nestjs/swagger';
import { AirQualityResult } from './dto/get-air-quality.output';

/**
 * Controller for cartography module, contains endpoints for cartography related operations
 * @export
 */
@Controller('cartography')
@ApiTags('cartography')
export class CartographyController {
  constructor(private readonly cartographyService: CartographyService) {}

  /**
   * /cartography/getParcelByCoordinates
   * Get parcel info by coordinates
   * @param getParcelInput
   * @returns
   */
  @Get('getParcelByCoordinates')
  getParcelByCoordinates(
    @Query() getParcelInput: GetParcelInputDto,
  ): Promise<GetParcelOutputDto> {
    return this.cartographyService.getParcelByCoordinates(getParcelInput);
  }

  /**
   * /cartography/getParcelShape
   * Get parcel shape by parcel number
   * @param getParcelShapeInput
   * @returns
   */
  @Get('getParcelShape')
  getParcelShape(
    @Query() getParcelShapeInput: GetParcelShapeInputDto,
  ): Promise<GetParcelShapeOutputDto> {
    return this.cartographyService.getParcelShape(getParcelShapeInput);
  }

  /**
   * /cartography/getCoordinatesByAddress
   * Get coordinates by address
   * @param getCoordsByAddressInput
   */
  @Get('getCoordinatesByAddress')
  getCoordinatesByAddress(
    @Query()
    getCoordsByAddressInput: GetCoordsByAddressInputDto,
  ): Promise<GetCoordsByAddressOutputDto> {
    return this.cartographyService.getCoordinatesByAddress(
      getCoordsByAddressInput,
    );
  }

  @Get('airQuality')
  async getAirQuality(): Promise<AirQualityResult[]> {
    return await fetch(
      `https://api.openaq.org/v2/latest?coordinates=${process.env.VITE_CITY_X},${process.env.VITE_CITY_Y}&radius=25000`,
      {
        method: 'GET',
        headers: {
          'X-API-Key': process.env.VITE_TEMP_API_KEY,
        },
      },
    )
      .then((response) => response.json())
      .then((data) => {
        return data.results.map((result) => {
          return {
            location: result.location,
            latitude: result.coordinates.latitude,
            longitude: result.coordinates.longitude,
            measurements: result.measurements.map((measurement) => {
              return {
                parameter: measurement.parameter,
                value: measurement.value,
                lastUpdated: measurement.lastUpdated,
                unit: measurement.unit,
              };
            }),
          };
        });
      });
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { CartographyService } from './cartography.service';
import { GetParcelOutputDto } from './dto/get-parcel.output';
import { GetParcelInputDto } from './dto/get-parcel.input';
import { GetParcelShapeInputDto } from './dto/get-parcel-shape.input';
import { GetParcelShapeOutputDto } from './dto/get-parcel-shape.output';
import { GetCoordsByAddressInputDto } from './dto/get-coords-by-address.input';
import { GetCoordsByAddressOutputDto } from './dto/get-coords-by-address.output';
import { ApiTags } from '@nestjs/swagger';

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
}

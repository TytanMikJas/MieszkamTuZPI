import { Injectable } from '@nestjs/common';
import { ParcelDataInternalOutputDto } from './dto/parcel-data.internal.output';
import { EPSG2180, EPSG4326 } from './uldk.types';
import { ParcelCoordinatesInternalOutputDto } from './dto/parcel-coordinates.internal.output';
import { FORMAT_ESPG2180, FORMAT_ESPG4326 } from './uldk.formats';
import {
  calculatePolygonBounds,
  calculatePolygonCenter,
  transformCoordinates,
} from './geotranslator.util';
import * as proj4 from 'proj4';
import fetch from 'node-fetch';
import { ParcelWKTInternalOutputDto } from './dto/parcel-wkt.internal.output';
import { getCoordsByAddresss } from './geocode.util';

@Injectable()
export class ULDKService {
  constructor() {}

  private async fetchULDK(endpoint: string): Promise<string> {
    return await fetch(`https://uldk.gugik.gov.pl/${endpoint}`).then(
      async (response) => {
        if (!response.ok) {
          throw new Error(`ULDK invalid request ${response.status}`);
        }
        const parsed = await response.text();
        const splitted = parsed.split('\n');
        if (splitted[0].split(' ')[0] == '-1') return 'error';
        return splitted[1];
      },
    );
  }

  epsg2180epsg4326(
    latitude: EPSG2180,
    longitude: EPSG2180,
  ): ParcelCoordinatesInternalOutputDto {
    return transformCoordinates(
      latitude,
      longitude,
      proj4(FORMAT_ESPG2180, FORMAT_ESPG4326),
    );
  }

  epsg4326epsg2180(
    longitude: EPSG4326,
    latitude: EPSG4326,
  ): ParcelCoordinatesInternalOutputDto {
    return transformCoordinates(
      longitude,
      latitude,
      proj4(FORMAT_ESPG4326, FORMAT_ESPG2180),
    );
  }

  calculatePolygonCenter(coordinates: number[][]): number[] {
    return calculatePolygonCenter(coordinates);
  }

  calculatePolygonBounds(coordinates: number[][]): number[] {
    return calculatePolygonBounds(coordinates);
  }

  async getParcelData(
    x: EPSG2180,
    y: EPSG2180,
  ): Promise<ParcelDataInternalOutputDto> {
    const parcelData = await this.fetchULDK(
      `?request=GetParcelByXY&xy=${x},${y}&result=parcel,region`,
    );
    if (parcelData == 'error')
      return { parcelNumber: '-1', parcelRegion: '-1 ' };
    const [parcelNumber, parcelRegion] = parcelData.split('|');
    return { parcelNumber, parcelRegion };
  }

  async getParcelWKT(
    x: EPSG2180,
    y: EPSG2180,
  ): Promise<ParcelWKTInternalOutputDto> {
    const parcelWKT = await this.fetchULDK(
      `?request=GetParcelByXY&xy=${x},${y}&result=geom_wkt`,
    );
    if (parcelWKT == 'error') return { parcelWKT: '-1' };
    return { parcelWKT: parcelWKT.split(';')[1] };
  }

  async getParcelWKTbyName(
    parcelNumber: string,
    parcelRegion: string,
  ): Promise<ParcelWKTInternalOutputDto> {
    const regionAndNumber = parcelRegion + ' ' + parcelNumber;
    const parcelWKT = await this.fetchULDK(
      `?request=GetParcelByIdOrNr&id=${regionAndNumber}&result=geom_wkt`,
    );
    if (parcelWKT == 'error') return { parcelWKT: '-1' };

    return { parcelWKT: parcelWKT.split(';')[1] };
  }

  async getCoordinatesByAddress(
    address: string,
  ): Promise<ParcelCoordinatesInternalOutputDto> {
    return await getCoordsByAddresss(`Polska, Wrocław, ${address}`);
  }
}

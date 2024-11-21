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
import proj4 from 'proj4';
import fetch from 'node-fetch';
import { ParcelWKTInternalOutputDto } from './dto/parcel-wkt.internal.output';
import { getCoordsByAddresss } from './geocode.util';

/**
 * ULDK service
 * @export
 * @class ULDKService
 */
@Injectable()
export class ULDKService {
  constructor() {}

  /**
   * Fetch ULDK
   * @param {string} endpoint
   * @returns {Promise<string>}
   */
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

  /**
   * Transform coordinates from EPSG2180 to EPSG4326
   * @param {EPSG2180} latitude
   * @param {EPSG2180} longitude
   * @returns {ParcelCoordinatesInternalOutputDto}
   */
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

  /**
   * Transform coordinates from EPSG4326 to EPSG2180
   * @param {EPSG4326} longitude
   * @param {EPSG4326} latitude
   * @returns {ParcelCoordinatesInternalOutputDto}
   */
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

  /**
   * Calculate polygon center
   * @param {number[][]} coordinates
   * @returns {number[]}
   */
  calculatePolygonCenter(coordinates: number[][]): number[] {
    return calculatePolygonCenter(coordinates);
  }

  /**
   * Calculate polygon bounds
   * @param {number[][]} coordinates
   * @returns {number[]}
   */
  calculatePolygonBounds(coordinates: number[][]): number[] {
    return calculatePolygonBounds(coordinates);
  }

  /**
   * Get parcel data
   * @param {EPSG2180} x
   * @param {EPSG2180} y
   * @returns {Promise<ParcelDataInternalOutputDto>}
   */
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

  /**
   * Get parcel WKT
   * @param {EPSG2180} x
   * @param {EPSG2180} y
   * @returns {Promise<ParcelWKTInternalOutputDto>}
   */
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

  /**
   * Get parcel WKT by name
   * @param {string} parcelNumber
   * @param {string} parcelRegion
   * @returns {Promise<ParcelWKTInternalOutputDto>}
   */
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

  /**
   * Get coordinates by address
   * @param {string} address
   * @returns {Promise<ParcelCoordinatesInternalOutputDto>}
   */
  async getCoordinatesByAddress(
    address: string,
  ): Promise<ParcelCoordinatesInternalOutputDto> {
    const cityName = process.env.VITE_CITY_NAME || 'Wrocław';
    return await getCoordsByAddresss(`Polska, ${cityName}, ${address}`);
  }
}

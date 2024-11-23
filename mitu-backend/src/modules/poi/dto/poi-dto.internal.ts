/**
 * Data transfer object for POI entity.
 * @export
 * @class POIDTO
 * @param {number} id
 * @param {string} title
 * @param {string} slug
 * @param {number} locationX
 * @param {number} locationY
 * @param {string} responsible
 * @param {string} street
 * @param {string} buildingNr
 * @param {string} apartmentNr
 */
export class POIDTO {
  id: number;
  title: string;
  slug: string;
  locationX: number;
  locationY: number;
  responsible: string;
  street?: string;
  buildingNr?: string;
  apartmentNr?: string;
}

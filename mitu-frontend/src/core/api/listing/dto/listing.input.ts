export default interface ListingInputDto {
  title: string;
  locationX: number;
  locationY: number;
  street?: string;
  buildingNr?: string;
  apartmentNr?: string;
  responsible: string;
  price: number;
  surface: number;
  content: string;
  thumbnail: string;
  sell: boolean;
}

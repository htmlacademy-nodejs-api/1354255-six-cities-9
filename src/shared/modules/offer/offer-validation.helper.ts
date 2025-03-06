import { IsLatitude, IsLongitude } from 'class-validator';

export class OfferLocationValidation {
  @IsLatitude()
    latitude: number;

  @IsLongitude()
    longitude: string;
}

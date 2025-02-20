import { OfferCity, OfferFacility, OfferHousing, OfferLocation, User } from '../../../types/index.js';

export class CreateOfferDto {
  title: string;
  description: string;
  date: Date;
  city: OfferCity;
  previewUrl: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: OfferHousing;
  rooms: number;
  guests: number;
  price: number;
  facilities: OfferFacility[];
  user: User;
  comments: number;
  location: OfferLocation;
}

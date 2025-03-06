import {
  OfferCity,
  OfferFacility,
  OfferHousing,
  OfferLocation,
  User,
} from '../../types/index.js';

export type Offer = {
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
  author: User;
  comments?: number;
  location: OfferLocation;
};

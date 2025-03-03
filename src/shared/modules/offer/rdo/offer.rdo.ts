import { Expose } from 'class-transformer';

import {
  OfferCity,
  OfferFacility,
  OfferHousing,
  User
} from '../../../types/index.js';

export class OfferRdo {
  @Expose()
    id: string;

  @Expose()
    title: string;

  @Expose()
    description: string;

  @Expose()
    createdAt?: Date;

  @Expose()
    city: OfferCity;

  @Expose()
    previewUrl: string;

  @Expose()
    images: string[];

  @Expose()
    isPremium: boolean;

  @Expose()
    comments: number;

  @Expose()
    rating: number;

  @Expose()
    type: OfferHousing;

  @Expose()
    rooms: number;

  @Expose()
    guests: number;

  @Expose()
    price: number;

  @Expose()
    facilities: OfferFacility[];

  @Expose()
    author: User;

  @Expose()
    location: {
    latitude: number;
    longitude: number;
  };
}

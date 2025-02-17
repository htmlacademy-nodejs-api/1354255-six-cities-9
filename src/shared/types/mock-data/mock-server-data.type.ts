import {
  MockOfferCity,
  OfferFacility,
  OfferHousing
} from '../index.js';


export type MockServerData = {
  titles: string[];
  descriptions: string[];
  cities: MockOfferCity[];
  previewUrls: string[];
  types: OfferHousing[];
  facilities: OfferFacility[];
  users: string[];
  emails: string[];
  avatars: string[];
};

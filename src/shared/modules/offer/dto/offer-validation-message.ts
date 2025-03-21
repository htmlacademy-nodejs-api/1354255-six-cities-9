import {
  DescriptionRules,
  GuestRules,
  ImageUrlRules,
  PriceRules,
  RatingRules,
  RoomRules,
  TitleRules
} from '../../../helpers/index.js';

export const OfferValidationMessage = {
  title: {
    invalidFormat: 'title must be a string',
    invalid: `Title length must be from ${TitleRules.MIN_LENGTH} to ${TitleRules.MAX_LENGTH} symbols`,
  },

  description: {
    invalidFormat: 'description must be a string',
    invalid: `Description length must be from ${DescriptionRules.MIN_LENGTH} to ${DescriptionRules.MAX_LENGTH}`,
  },

  date: {
    invalidFormat: 'date must be a valid ISO date',
  },

  city: {
    invalid: 'The city specified is not supported',
  },

  previewUrl: {
    invalidFormat: 'preview must be a string',
    maxLength: `Preview url must not be longer than ${ImageUrlRules.MAX_LENGTH} characters`,
  },

  images: {
    invalidFormat: 'Images field must be an array of strings',
    maxLength:
      `All photos in images array must not be longer than ${ImageUrlRules.MAX_LENGTH} characters`,
  },

  isPremium: {
    invalid: 'isPremium field must be boolean',
  },

  isFavorite: {
    invalid: 'isFavorite field must be boolean',
  },

  rating: {
    minValue: `Rating must be at least ${RatingRules.MIN}`,
    maxValue: `Rating must not be greater than ${RatingRules.MAX}`
  },

  type: {
    invalid: 'The type specified is not supported',
  },

  rooms: {
    invalidFormat: 'roomsNumber must be an integer',
    minValue: `Minimum roomsNumber is ${RoomRules.MIN}`,
    maxValue: `Maximum roomsNumber is ${RoomRules.MAX}`,
  },

  guests: {
    invalidFormat: 'guestsNumber must be an integer',
    minValue: `Minimum guestsNumber is ${GuestRules.MIN}`,
    maxValue: `Maximum guestsNumber is ${GuestRules.MAX}`,
  },

  price: {
    invalidFormat: 'Price must be a number',
    minValue: `Minimum price is ${PriceRules.MIN}`,
    maxValue: `Maximum price is ${PriceRules.MAX}`,
  },

  facilities: {
    invalidFormat: 'facilities field must be an array',
    invalid: 'One or more facilities specified is not supported.',
  },

  author: {
    invalidId: 'author field must be a valid id',
  },

  location: {
    invalid: 'longitude or latitude is incorrect',
  },
} as const;

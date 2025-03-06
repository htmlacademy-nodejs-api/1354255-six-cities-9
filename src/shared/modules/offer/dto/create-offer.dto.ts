import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  Length,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import {
  DescriptionRules,
  GuestRules,
  ImageUrlRules,
  PriceRules,
  RatingRules,
  RoomRules,
  TitleRules
} from '../../../helpers/consts.js';
import {
  ID,
  Offer,
  OfferCity,
  OfferFacility,
  OfferHousing,
  OfferLocation,
} from '../../../types/index.js';
import { OfferLocationValidation } from '../offer-validation.helper.js';
import { OfferValidationMessage } from './offer-validation-message.js';

export class CreateOfferDto implements Omit<Offer, 'author'> {
  @Length(TitleRules.MIN_LENGTH, TitleRules.MAX_LENGTH, { message: OfferValidationMessage.title.invalid })
    title: string;

  @Length(DescriptionRules.MIN_LENGTH, DescriptionRules.MAX_LENGTH, { message: OfferValidationMessage.description.invalid })
    description: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: OfferValidationMessage.date.invalidFormat },
  )
    date: Date;

  @IsEnum(OfferCity, { message: OfferValidationMessage.city.invalid })
    city: OfferCity;

  @MaxLength(ImageUrlRules.MAX_LENGTH, { message: OfferValidationMessage.previewUrl.maxLength })
    previewUrl: string;

  @IsArray({ message: OfferValidationMessage.images.invalidFormat })
  @MaxLength(ImageUrlRules.MAX_LENGTH, {
    each: true,
    message: OfferValidationMessage.images.maxLength,
  })
    images: string[];

  @IsBoolean({ message: OfferValidationMessage.isPremium.invalid })
    isPremium: boolean;

  @IsBoolean({ message: OfferValidationMessage.isFavorite.invalid })
    isFavorite: boolean;

  @IsInt()
  @Min(RatingRules.MIN, { message: OfferValidationMessage.rating.minValue })
  @Max(RatingRules.MAX, { message: OfferValidationMessage.rating.maxValue })
    rating: number;

  @IsEnum(OfferHousing, {
    message: OfferValidationMessage.type.invalid,
  })
    type: OfferHousing;

  @IsInt({ message: OfferValidationMessage.rooms.invalidFormat })
  @Min(RoomRules.MIN, { message: OfferValidationMessage.rooms.minValue })
  @Max(RoomRules.MAX, { message: OfferValidationMessage.rooms.maxValue })
    rooms: number;

  @IsInt({ message: OfferValidationMessage.guests.invalidFormat })
  @Min(GuestRules.MIN, { message: OfferValidationMessage.guests.minValue })
  @Max(GuestRules.MAX, { message: OfferValidationMessage.guests.maxValue })
    guests: number;

  @IsInt({ message: OfferValidationMessage.price.invalidFormat })
  @Min(PriceRules.MIN, { message: OfferValidationMessage.price.minValue })
  @Max(PriceRules.MAX, { message: OfferValidationMessage.price.maxValue })
    price: number;

  @IsArray({ message: OfferValidationMessage.facilities.invalidFormat })
  @IsEnum(OfferFacility, {
    each: true,
    message: OfferValidationMessage.facilities.invalid,
  })
    facilities: OfferFacility[];

  @IsMongoId({ message: OfferValidationMessage.author.invalidId })
    author: ID;

  @IsNotEmpty()
  @ValidateNested({
    each: true,
    message: OfferValidationMessage.location.invalid,
  })
  @Type(() => OfferLocationValidation)
    location: OfferLocation;
}

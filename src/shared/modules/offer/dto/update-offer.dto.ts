import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import { Expose, Type } from 'class-transformer';
import { DescriptionRules, GuestRules, ImageUrlRules, PriceRules, RatingRules, RoomRules, TitleRules } from '../../../helpers/index.js';
import { OfferLocationValidation } from '../offer-validation.helper.js';
import {
  ID,
  OfferCity,
  OfferFacility,
  OfferHousing,
  OfferLocation,
} from './../../../types/index.js';
import { OfferValidationMessage } from './offer-validation-message.js';

export class UpdateOfferDto {
  @IsOptional()
  @IsString({ message: OfferValidationMessage.title.invalidFormat })
  @Length(TitleRules.MIN_LENGTH, TitleRules.MAX_LENGTH, { message: OfferValidationMessage.title.invalid })
  @Expose()
    title?: string;

  @IsOptional()
  @IsString({ message: OfferValidationMessage.description.invalidFormat })
  @Length(DescriptionRules.MIN_LENGTH, DescriptionRules.MAX_LENGTH, { message: OfferValidationMessage.description.invalid })
  @Expose()
    description?: string;

  @IsOptional()
  @IsDateString(
    {},
    { message: OfferValidationMessage.date.invalidFormat },
  )
    date?: Date;

  @IsOptional()
  @IsEnum(OfferCity, { message: OfferValidationMessage.city.invalid })
  @Expose()
    city?: OfferCity;

  @IsOptional()
  @IsString({ message: OfferValidationMessage.previewUrl.invalidFormat })
  @MaxLength(ImageUrlRules.MAX_LENGTH, { message: OfferValidationMessage.previewUrl.maxLength })
  @Expose()
    previewUrl?: string;

  @IsOptional()
  @IsArray({ message: OfferValidationMessage.images.invalidFormat })
  @IsString({
    each: true,
    message: OfferValidationMessage.images.invalidFormat,
  })
  @MaxLength(ImageUrlRules.MAX_LENGTH, {
    each: true,
    message: OfferValidationMessage.images.maxLength,
  })
  @Expose()
    images?: string[];

  @IsOptional()
  @IsBoolean({ message: OfferValidationMessage.isPremium.invalid })
  @Expose()
    isPremium?: boolean;

  @IsOptional()
  @IsBoolean({ message: OfferValidationMessage.isFavorite.invalid })
  @Expose()
    isFavorite?: boolean;

  @IsOptional()
  @IsInt()
  @Min(RatingRules.MIN, { message: OfferValidationMessage.rating.minValue })
  @Max(RatingRules.MAX, { message: OfferValidationMessage.rating.maxValue })
  @Expose()
    rating?: number;

  @IsOptional()
  @IsEnum(OfferHousing, {
    message: OfferValidationMessage.type.invalid,
  })
  @Expose()
    type?: OfferHousing;

  @IsOptional()
  @IsInt({ message: OfferValidationMessage.rooms.invalidFormat })
  @Min(RoomRules.MIN, { message: OfferValidationMessage.rooms.minValue })
  @Max(RoomRules.MAX, { message: OfferValidationMessage.rooms.maxValue })
  @Expose()
    rooms?: number;

  @IsOptional()
  @IsInt({ message: OfferValidationMessage.guests.invalidFormat })
  @Min(GuestRules.MIN, { message: OfferValidationMessage.guests.minValue })
  @Max(GuestRules.MAX, { message: OfferValidationMessage.guests.maxValue })
  @Expose()
    guests?: number;

  @IsOptional()
  @IsNumber({}, { message: OfferValidationMessage.price.invalidFormat })
  @Min(PriceRules.MIN, { message: OfferValidationMessage.price.minValue })
  @Max(PriceRules.MAX, { message: OfferValidationMessage.price.maxValue })
  @Expose()
    price?: number;

  @IsOptional()
  @IsArray({ message: OfferValidationMessage.facilities.invalidFormat })
  @IsEnum(OfferFacility, {
    each: true,
    message: OfferValidationMessage.facilities.invalid,
  })
  @Expose()
    facilities?: OfferFacility[];

  @IsOptional()
  @IsMongoId({ message: OfferValidationMessage.author.invalidId })
    author: ID;

  @IsOptional()
  @IsNotEmpty()
  @ValidateNested({
    each: true,
    message: OfferValidationMessage.location.invalid,
  })
  @Type(() => OfferLocationValidation)
    location?: OfferLocation;
}

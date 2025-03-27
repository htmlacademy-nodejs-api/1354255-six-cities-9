import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';

import { OfferCity, OfferFacility, OfferHousing, OfferLocation } from '../../types/index.js';
import { UserEntity } from '../user/user.entity.js';

// это намеренное слияние класса и интерфейса
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})

// это намеренное слияние класса и интерфейса
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public title: string;

  @prop({ trim: true, required: true })
  public description: string;

  @prop({ type: () => String, enum: OfferCity, required: true })
  public city: OfferCity;

  @prop({ required: true })
  public previewUrl: string;

  @prop({ required: true })
  public images: string[];

  @prop({ required: true, default: false })
  public isPremium: boolean;

  @prop({ required: true })
  public type: OfferHousing;

  @prop({ required: true })
  public rooms: number;

  @prop({ required: true })
  public guests: number;

  @prop({ required: true })
  public price: number;

  @prop({ type: () => String, enum: OfferFacility, required: true })
  public facilities: OfferFacility[];

  @prop({ ref: UserEntity, required: true })
  public user: Ref<UserEntity>;

  @prop({ required: true })
  public location: OfferLocation;
}

export const OfferModel = getModelForClass(OfferEntity);

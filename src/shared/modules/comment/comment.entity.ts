import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';

import { OfferEntity } from '../offer/offer.entity.js';
import { UserEntity } from '../user/index.js';

// это намеренное слияние класса и интерфейса
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  },
})

// это намеренное слияние класса и интерфейса
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public text: string;

  @prop({ required: true })
  public rating: number;

  @prop({ ref: UserEntity, required: true })
  public author: Ref<UserEntity>;

  @prop({ ref: OfferEntity, required: true })
  public offer: Ref<OfferEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);

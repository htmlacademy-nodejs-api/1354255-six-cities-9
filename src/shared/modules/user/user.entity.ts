import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop
} from '@typegoose/typegoose';
import { Types } from 'mongoose';

import { createSHA256 } from '../../helpers/index.js';
import { User, UserStatus } from '../../types/index.js';

// это намеренное слияние класса и интерфейса
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})

// это намеренное слияние класса и интерфейса
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({ unique: true, required: true })
  public email: string;

  @prop({ required: false, default: '' })
  public avatarUrl?: string;

  @prop({ required: true, default: '' })
  public name: string;

  @prop({ required: true })
  private password?: string;

  @prop({
    type: Types.ObjectId,
    required: true,
    default: [],
  })
  public favorites: Types.ObjectId[];

  @prop({ required: false, default: UserStatus.Regular })
  public type: UserStatus;

  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.avatarUrl = userData.avatarUrl;
    this.name = userData.name;
    this.type = userData.type;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);

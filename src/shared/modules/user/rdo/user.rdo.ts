import { Expose } from 'class-transformer';

import { UserStatus } from '../../../types/index.js';

export class UserRdo {
  @Expose()
  public email: string;

  @Expose()
  public name: string;

  @Expose()
  public avatarUrl?: string;

  @Expose()
  public type: UserStatus;
}

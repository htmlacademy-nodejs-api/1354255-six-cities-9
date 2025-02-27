import { UserStatus } from '../../../types/index.js';

export class UpdateUserDto {
  public name?: string;
  public avatarUrl?: string;
  public type?: UserStatus;
}

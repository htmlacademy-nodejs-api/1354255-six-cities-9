import { UserStatus } from '../../../types/index.js';

export class CreateUserDto {
  name: string;
  email: string;
  avatarUrl?: string;
  password: string;
  type: UserStatus;
}

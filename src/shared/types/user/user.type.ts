import { UserStatus } from '../index.js';

export type User = {
  name: string;
  email: string;
  avatarUrl?: string;
  password: string;
  type: UserStatus;
}

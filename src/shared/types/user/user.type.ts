import { UserStatus } from '../index.js';

export type User = {
  name: string;
  email: string;
  avatarUrl?: string;
  type: UserStatus;
}

export type UserWithPassword = User & { password: string }

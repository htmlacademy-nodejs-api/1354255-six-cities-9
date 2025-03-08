import { UserStatus } from '../../../types/index.js';
import { NameRules, PasswordRules } from '../user.constant.js';

export const UserValidationMessage = {
  name: {
    invalidFormat: 'name is required',
    invalid: `min length is ${NameRules.MIN_LENGTH}, max is ${NameRules.MAX_LENGTH}`,
  },
  email: {
    invalidFormat: 'Email is invalid',
  },
  avatarUrl: {
    invalidFormat: 'Must be a string',
  },
  type: {
    invalid: `type must be ${UserStatus.Regular} or ${UserStatus.Pro}`,
  },
  password: {
    invalidFormat: 'password is required',
    invalid: `min length for password is ${PasswordRules.MIN_LENGTH}, max is ${PasswordRules.MAX_LENGTH}`,
  },
} as const;

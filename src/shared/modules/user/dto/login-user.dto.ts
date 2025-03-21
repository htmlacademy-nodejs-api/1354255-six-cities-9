import { Expose } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';

import { PasswordRules } from '../user.constant.js';
import { UserValidationMessage } from './user-validation-message.js';

export class LoginUserDto {
  @IsEmail({}, { message: UserValidationMessage.email.invalidFormat })
  @Expose()
    email: string;

  @IsString({ message: UserValidationMessage.password.invalidFormat })
  @Length(
    PasswordRules.MIN_LENGTH,
    PasswordRules.MAX_LENGTH,
    { message: UserValidationMessage.password.invalid }
  )
  @Expose()
    password: string;
}

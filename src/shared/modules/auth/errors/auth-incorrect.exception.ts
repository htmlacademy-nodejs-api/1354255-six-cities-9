import { StatusCodes } from 'http-status-codes';

import { BaseUserException } from './base-user.exception.js';

export class AuthIncorrectException extends BaseUserException {
  constructor() {
    super(StatusCodes.UNAUTHORIZED, 'Incorrect email or password');
  }
}

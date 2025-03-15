import { StatusCodes } from 'http-status-codes';

import { BaseUserException } from './base-user.exception.js';

export class UserIncorrectCredsException extends BaseUserException {
  constructor() {
    super(StatusCodes.UNAUTHORIZED, 'Incorrect user name or password');
  }
}

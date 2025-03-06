import { Request } from 'express';

import { CreateUserDto } from '../../modules/user/dto/create-user.dto.js';
import { LoginUserDto } from '../../modules/user/dto/login-user.dto.js';
import { RequestBody, RequestParams } from '../index.js';

export type CreateUserRequest = Request<
  RequestParams,
  RequestBody,
  CreateUserDto
>;

export type LoginUserRequest = Request<
  RequestParams,
  RequestBody,
  LoginUserDto
>;

import { inject, injectable } from 'inversify';
import { SignJWT } from 'jose';
import * as crypto from 'node:crypto';

import { Config, RestSchema, RestSchemaEnum } from '../../libs/config/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Component, TokenPayload } from '../../types/index.js';
import { LoginUserDto, UserEntity, UserService } from '../user/index.js';
import { AuthService } from './auth-service.interface.js';
import {
  UserIncorrectCredsException,
  UserNotFoundException,
} from './index.js';

@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get(RestSchemaEnum.JwtSecret);
    const secretKey = crypto.createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TokenPayload = {
      email: user.email,
      name: user.name,
      id: user.id,
    };

    this.logger.info(`Create token for ${user.email}`);

    return new SignJWT(tokenPayload)
      .setProtectedHeader({ alg: this.config.get(RestSchemaEnum.JwtAlgorithm) })
      .setIssuedAt()
      .setExpirationTime(this.config.get(RestSchemaEnum.JwtExpired))
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      this.logger.warn(`User with ${dto.email} not found`);

      throw new UserNotFoundException();
    }

    if (!user.verifyPassword(dto.password, this.config.get(RestSchemaEnum.Salt))) {
      this.logger.warn(`Incorrect password for ${dto.email}`);

      throw new UserIncorrectCredsException();
    }

    return user;
  }
}

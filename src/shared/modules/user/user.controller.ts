import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { fillDTO } from '../../helpers/common.js';
import { Config, RestSchema, RestSchemaEnum } from '../../libs/config/index.js';
import { Logger } from '../../libs/logger/index.js';
import {
  BaseController,
  HttpError,
  UploadFileMiddleware,
  UserRoute,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware
} from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { HttpMethod, UserStatus } from '../../types/index.js';
import { AuthService } from '../auth/index.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { CreateUserDto } from './index.js';
import { LoginUserRequest } from './login-user-request.type.js';
import { LoggedUserRdo } from './rdo/logged-user.rdo.js';
import { UserRdo } from './rdo/user.rdo.js';
import { UserService } from './user-service.interface.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.AuthService) private readonly authService: AuthService,
    @inject(Component.Config)
    private readonly configService: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info(`Register routes for ${UserController.name}…`);

    this.addRoutes([
      {
        path: UserRoute.REGISTER,
        method: HttpMethod.Post,
        handler: this.create,
        middlewares: [new ValidateDtoMiddleware(CreateUserDto)],
      },

      {
        path: UserRoute.LOGIN,
        method: HttpMethod.Post,
        handler: this.login,
        middlewares: [new ValidateDtoMiddleware(LoginUserDto)],
      },

      {
        path: UserRoute.LOGIN,
        handler: this.checkAuthenticate,
      },

      {
        path: UserRoute.UPLOAD_AVATAR,
        method: HttpMethod.Post,
        handler: this.uploadAvatar,
        middlewares: [
          new ValidateObjectIdMiddleware('userId'),
          new UploadFileMiddleware(
            this.configService.get(RestSchemaEnum.UploadDirectory),
            'avatar',
          ),
        ],
      },
    ]);
  }

  public async create(
    {
      body,
      tokenPayload,
    }: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response,
  ): Promise<void> {
    if (tokenPayload) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Only anonymous users are allowed to register a new account',
        UserController.name,
      );
    }

    const existingUser = await this.userService.findByEmail(body.email);

    if (existingUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        UserController.name,
      );
    }

    body.type = UserStatus.Regular;

    const result = await this.userService.create(
      body,
      this.configService.get(RestSchemaEnum.Salt),
    );

    this.created(res, fillDTO(UserRdo, result));
  }

  public async login({ body }: LoginUserRequest, res: Response) {
    const user = await this.authService.verify(body);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, {
      email: user.email,
      token,
    });

    this.ok(res, responseData);
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path,
    });
  }

  public async checkAuthenticate({ tokenPayload }: Request, res: Response) {
    const user = await this.userService.findByEmail(tokenPayload?.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        UserController.name,
      );
    }

    this.ok(res, fillDTO(UserRdo, user));
  }
}

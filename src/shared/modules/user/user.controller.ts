import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { fillDTO } from '../../helpers/common.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { Logger } from '../../libs/logger/index.js';
import { BaseController, HttpError, UploadFileMiddleware, UserRoute, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { HttpMethod } from '../../types/index.js';
import { CreateUserRequest } from './create-user-request.type.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { CreateUserDto } from './index.js';
import { LoginUserRequest } from './login-user-request.type.js';
import { UserRdo } from './rdo/user.rdo.js';
import { UserService } from './user-service.interface.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
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
        path: UserRoute.UPLOAD,
        method: HttpMethod.Post,
        handler: this.uploadAvatar,
        middlewares: [
          new ValidateObjectIdMiddleware('userId'),
          new UploadFileMiddleware(
            this.configService.get('UPLOAD_DIRECTORY'),
            'avatar',
          ),
        ],
      },
    ]);
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const existingUser = await this.userService.findByEmail(body.email);

    if (existingUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        UserController.name,
      );
    }

    const result = await this.userService.create(
      body,
      this.configService.get('SALT'),
    );

    this.created(res, fillDTO(UserRdo, result));
  }

  public async login({ body }: LoginUserRequest, _res: Response) {
    const user = await this.userService.findByEmail(body.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        UserController.name,
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      UserController.name,
    );
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path,
    });
  }
}

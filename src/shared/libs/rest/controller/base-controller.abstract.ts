import { Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';

import { HttpMethod } from '../../../types/index.js';
import { Logger } from '../../logger/index.js';
import { Route } from '../route/route.interface.js';
import { Controller } from './controller.interface.js';

@injectable()
export abstract class BaseController implements Controller {
  private readonly DEFAULT_CONTENT_TYPE = 'application/json';
  private readonly _router: Router;

  constructor(
    protected readonly logger: Logger
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoutes(routes: Route | Route[]) {
    for (const route of [routes].flat(2)) {
      this.addRoute(route);
    }
  }

  public addRoute(route: Route) {
    route.method = route.method ?? HttpMethod.Get;

    const wrapperAsyncHandler = asyncHandler(route.handler.bind(this));

    const middlewareHandlers = route.middlewares?.map((item) =>
      asyncHandler(item.execute.bind(item)),
    );
    const allHandlers = middlewareHandlers
      ? [...middlewareHandlers, wrapperAsyncHandler]
      : wrapperAsyncHandler;

    this._router[route.method](route.path, allHandlers);

    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    res
      .type(this.DEFAULT_CONTENT_TYPE)
      .status(statusCode)
      .json(data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }
}

import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { OfferController } from '../../../modules/offer/offer.controller.js';
import { OfferCity } from '../../../types/index.js';
import { HttpError } from '../errors/index.js';
import { Middleware } from './middleware.interface.js';

export class ValidateCityQueryMiddleware implements Middleware {
  constructor(private param: string = 'city') {}

  public execute(
    { params }: Request,
    _res: Response,
    next: NextFunction,
  ): void {
    const city = params[this.param];

    if (!Object.values(OfferCity).includes(city as OfferCity)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `The city ${params.city} is not supported`,
        OfferController.name,
      );
    }

    return next();
  }
}

import { DocumentType } from '@typegoose/typegoose';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { OfferEntity, OfferService } from '../../../modules/offer/index.js';
import { OfferController } from '../../../modules/offer/offer.controller.js';
import { HttpError } from '../errors/index.js';
import { Middleware } from './middleware.interface.js';

export class UserHasOfferMiddleware implements Middleware {
  constructor(private readonly offerService: OfferService) {}

  public async execute(
    { params, tokenPayload }: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const offer = (await this.offerService.findById(
      params.offerId,
    )) as DocumentType<OfferEntity>;

    if (!(offer.user._id.toString() === tokenPayload.id)) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        OfferController.name,
      );
    }

    return next();
  }
}

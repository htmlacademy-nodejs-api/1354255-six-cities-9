import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { fillDTO } from '../../helpers/common.js';
import { Logger } from '../../libs/logger/index.js';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  OfferRoute,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import {
  AllOffersRequest,
  Component,
  CreateOfferRequest,
  HttpMethod,
  ParamOfferId
} from '../../types/index.js';
import { CreateOfferDto, OfferRdo, UpdateOfferDto } from './index.js';
import { OfferService } from './offer-service.interface.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService)
    protected readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info(`Register routes for ${OfferController.name}…`);

    this.addRoutes([
      {
        path: OfferRoute.OFFER_ID,
        handler: this.show,
        middlewares: [
          new ValidateObjectIdMiddleware('offerId'),
          new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        ],
      },

      {
        path: OfferRoute.OFFER_ID,
        method: HttpMethod.Delete,
        handler: this.delete,
        middlewares: [
          new ValidateObjectIdMiddleware('offerId'),
          new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        ],
      },

      {
        path: OfferRoute.OFFER_ID,
        method: HttpMethod.Patch,
        handler: this.update,
        middlewares: [
          new ValidateObjectIdMiddleware('offerId'),
          new ValidateDtoMiddleware(UpdateOfferDto),
          new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        ],
      },

      { path: OfferRoute.INDEX,
        handler: this.index
      },

      {
        path: OfferRoute.INDEX,
        method: HttpMethod.Post,
        handler: this.create,
        middlewares: [new ValidateDtoMiddleware(CreateOfferDto)],
      },
    ]);
  }

  public async index(req: AllOffersRequest, res: Response) {
    let count: number | undefined = undefined;

    if (req.query.count) {
      count = +req.query.count;
    }

    const offers = await this.offerService.find(count);

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create({ body }: CreateOfferRequest, res: Response) {
    const result = await this.offerService.create(body);
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async show({ params }: Request<ParamOfferId>, res: Response) {
    const { offerId } = params;

    const offer = await this.offerService.findById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `The offer with id ${offerId} was not found.`,
        OfferController.name,
      );
    }

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async update(
    { body, params }: Request<ParamOfferId, unknown, UpdateOfferDto>,
    res: Response,
  ): Promise<void> {
    const result = await this.offerService.updateById(params.offerId, body);
    const updatedOffer = await this.offerService.findById(result?.id);

    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        OfferController.name,
      );
    }

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async delete(
    { params }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;

    const offer = await this.offerService.deleteById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        OfferController.name,
      );
    }

    this.noContent(res, offer);
  }
}

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
  PrivateRouteMiddleware,
  UserHasOfferMiddleware,
  ValidateCityQueryMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import {
  Component,
  HttpMethod,
  OfferCity,
  ParamOfferCity,
  ParamOfferId
} from '../../types/index.js';
import { CommentService } from '../comment/index.js';
import { UserService } from '../user/index.js';
import { GetOffersQueryDto } from './dto/get-offers-query.dto.js';
import { CreateOfferDto, OfferRdo, UpdateOfferDto } from './index.js';
import { OfferService } from './offer-service.interface.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) protected readonly offerService: OfferService,
    @inject(Component.UserService) protected readonly userService: UserService,
    @inject(Component.CommentService) protected readonly commentService: CommentService,
  ) {
    super(logger);

    this.logger.info(`Register routes for ${OfferController.name}…`);

    const offerIdMiddlewares = [
      new ValidateObjectIdMiddleware('offerId'),
      new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
    ];

    this.addRoutes([
      {
        path: OfferRoute.OFFER_ID,
        handler: this.show,
        middlewares: offerIdMiddlewares,
      },

      {
        path: OfferRoute.OFFER_ID,
        method: HttpMethod.Delete,
        handler: this.delete,
        middlewares: [
          new PrivateRouteMiddleware(),
          ...offerIdMiddlewares,
          new UserHasOfferMiddleware(this.offerService),
        ],
      },

      {
        path: OfferRoute.OFFER_ID,
        method: HttpMethod.Patch,
        handler: this.update,
        middlewares: [
          new PrivateRouteMiddleware(),
          ...offerIdMiddlewares,
          new UserHasOfferMiddleware(this.offerService),
          new ValidateDtoMiddleware(UpdateOfferDto),
        ],
      },

      {
        path: OfferRoute.INDEX,
        handler: this.index,
      },

      {
        path: OfferRoute.INDEX,
        method: HttpMethod.Post,
        handler: this.create,
        middlewares: [
          new PrivateRouteMiddleware(),
          new ValidateDtoMiddleware(CreateOfferDto)
        ],
      },

      {
        path: OfferRoute.PREMIUM,
        handler: this.getPremiumOfferByCity,
        middlewares: [new ValidateCityQueryMiddleware()],
      },

      {
        path: OfferRoute.FAVORITE_OFFER,
        method: HttpMethod.Post,
        handler: this.addToFavorite,
        middlewares: [new PrivateRouteMiddleware(), ...offerIdMiddlewares],
      },

      {
        path: OfferRoute.FAVORITE_OFFER,
        method: HttpMethod.Delete,
        handler: this.removeFromFavorite,
        middlewares: [
          new PrivateRouteMiddleware(),
          ...offerIdMiddlewares,
          new UserHasOfferMiddleware(this.offerService),
        ],
      },

      {
        path: OfferRoute.FAVORITES,
        handler: this.getFavorite,
        middlewares: [new PrivateRouteMiddleware()],
      },
    ]);
  }

  public async index(
    {
      query,
      tokenPayload,
    }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      Record<string, unknown>,
      GetOffersQueryDto
    >,
    res: Response,
  ) {
    const offers = await this.offerService.find(query?.count, tokenPayload?.id);

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create(
    {
      body,
      tokenPayload,
    }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      CreateOfferDto
    >,
    res: Response,
  ) {
    const result = await this.offerService.create({
      ...body,
      author: tokenPayload.id,
    });
    const offer = await this.offerService.findById(result.id);

    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async show({ params, tokenPayload }: Request<ParamOfferId>, res: Response) {
    const { offerId } = params;

    const offer = await this.offerService.findById(offerId, tokenPayload?.id);

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

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async delete(
    { params }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const [deletedOffer] = await Promise.all([
      this.offerService.deleteById(offerId),
      this.commentService.deleteByOfferId(offerId),
    ]);

    this.noContent(res, `Offer with id ${deletedOffer?.id} was deleted`);
  }

  public async getFavorite({ tokenPayload }: Request, res: Response) {
    const offers = await this.offerService.findFavorite(tokenPayload?.id);

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async addToFavorite(
    { params, tokenPayload }: Request<ParamOfferId, unknown>,
    res: Response,
  ) {
    const result = await this.offerService.addToFavorite(
      params.offerId,
      tokenPayload.id,
    );

    if (!result) {
      throw new HttpError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Adding offer with id ${params.offerId} to favorites failed`,
        OfferController.name,
      );
    }

    this.created(
      res,
      `Offer with id ${params.offerId} was added to favorites`,
    );
  }

  public async getPremiumOfferByCity(
    { params, tokenPayload }: Request<ParamOfferCity>,
    res: Response,
  ) {
    if (!Object.values(OfferCity).includes(params?.city as OfferCity)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `The city ${params.city} is not supported`,
        'OfferController',
      );
    }

    const offers = await this.offerService.findPremiumByCity(
      params?.city as OfferCity,
      tokenPayload?.id,
    );

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async removeFromFavorite(
    { params, tokenPayload }: Request<ParamOfferId, unknown>,
    res: Response,
  ) {
    const result = await this.offerService.removeFromFavorite(
      params.offerId,
      tokenPayload.id,
    );

    if (!result) {
      throw new HttpError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Removing offer with id "${params.offerId}" from favorites failed`,
        'OfferController',
      );
    }

    this.noContent(
      res,
      `Offer with id "${params.offerId}" was removed from favorites`,
    );
  }
}

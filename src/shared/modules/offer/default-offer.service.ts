import { DocumentType, types } from '@typegoose/typegoose';
import { inject } from 'inversify';

import { Logger } from '../../libs/logger/index.js';
import { Component, OfferCity, SortType } from '../../types/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferService } from './offer-service.interface.js';
import { DEFAULT_OFFER_COUNT, DEFAULT_PREMIUM_OFFER_COUNT } from './offer.constant.js';
import { OfferEntity } from './offer.entity.js';

export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);

    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate(['author']);
  }

  public async find(
    count?: number,
  ): Promise<types.DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;

    return this.offerModel.aggregate([
      {
        $lookup: {
          from: 'comments',
          let: { offerId: '$_id' },
          pipeline: [
            { $match: { offer: '$$offerId' } },
            { $project: { rating: 1 } },
          ],
          as: 'comments',
        },
      },
      {
        $addFields: {
          id: { $toString: '$_id' },
          commentsCount: { $size: '$comments' },
          rating: { $avg: '$comments.rating' },
        },
      },
      { $limit: limit },
      { $sort: { createdAt: SortType.Down } },
    ]);
  }

  public async deleteById(
    offerId: string,
  ): Promise<types.DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId);
  }

  public async updateById(
    offerId: string,
    dto: UpdateOfferDto,
  ): Promise<types.DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate(['author']);
  }

  public async findPremiumByCity(
    city: OfferCity,
  ): Promise<types.DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city, isPremium: true })
      .sort({ createdAt: SortType.Down })
      .limit(DEFAULT_PREMIUM_OFFER_COUNT)
      .populate(['author']);
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel.exists({ _id: documentId })) !== null;
  }
}

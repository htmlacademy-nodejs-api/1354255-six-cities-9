import { Request } from 'express';
import { Query } from 'express-serve-static-core';

import { CreateOfferDto } from '../../modules/offer/dto/create-offer.dto.js';
import { RequestBody, RequestParams } from '../index.js';

export type AllOffersRequest = Request<
  RequestParams,
  RequestBody,
  RequestBody,
  { count: string } | Query
>;

export type CreateOfferRequest = Request<
  RequestParams,
  RequestBody,
  CreateOfferDto
>;

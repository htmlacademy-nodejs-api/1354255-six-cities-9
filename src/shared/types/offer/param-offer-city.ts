import { ParamsDictionary } from 'express-serve-static-core';

import { OfferCity } from './offer-city.enum.js';

export type ParamOfferCity = { city: OfferCity } | ParamsDictionary;

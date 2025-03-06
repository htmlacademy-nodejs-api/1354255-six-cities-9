import dayjs from 'dayjs';

import {
  CommentRules,
  generateRandomValue,
  getRandomBoolean,
  getRandomItem,
  getRandomItems,
  GuestRules,
  PriceRules,
  RatingRules,
  RoomRules
} from '../../helpers/index.js';
import { MockOfferCity, MockServerData, UserStatus } from '../../types/index.js';
import { OfferGenerator } from './offer-generator.interface.js';

const Weekday = {
  FIRST: 1,
  LAST: 7
};

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const city = getRandomItem<MockOfferCity>(this.mockData.cities);
    const previewUrl = getRandomItem<string>(this.mockData.previewUrls);
    const images = getRandomItems<string>(this.mockData.previewUrls, 6).join(';');
    const isPremium = getRandomBoolean();
    const isFavorite = getRandomBoolean();
    const rating = generateRandomValue(RatingRules.MIN, RatingRules.MAX);
    const type = getRandomItem(this.mockData.types);
    const rooms = generateRandomValue(RoomRules.MIN, RoomRules.MAX);
    const guests = generateRandomValue(GuestRules.MIN, GuestRules.MAX);
    const price = generateRandomValue(PriceRules.MIN, PriceRules.MAX).toString();
    const facilities = getRandomItems<string>(this.mockData.facilities).join(';');
    const comments = generateRandomValue(CommentRules.MIN, CommentRules.MAX);

    const name = getRandomItem(this.mockData.users);
    const email = getRandomItem(this.mockData.emails);
    const avatar = getRandomItem(this.mockData.avatars);
    const isPro = getRandomItem([UserStatus.Regular, UserStatus.Pro]);

    const date = dayjs()
      .subtract(generateRandomValue(Weekday.FIRST, Weekday.LAST), 'day')
      .toISOString();

    const user = [name, email, avatar, email, isPro].join(';');
    const location = [city.location.latitude, city.location.longitude].join(';');

    return [
      title,
      description,
      date,
      city.name,
      previewUrl,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      rooms,
      guests,
      price,
      facilities,
      user,
      comments,
      location,
    ].join('\t');
  }
}

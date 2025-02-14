import { readFileSync } from 'node:fs';

import {
  Offer,
  OfferCity,
  OfferFacility,
  OfferHousing,
  OfferLocation,
  User
} from '../../types/index.js';
import { FileReader } from './file-reader.interface.js';

type BooleanString = 'true' | 'false';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(private readonly filename: string) {}

  private validateRawData(): void {
    if (!this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      date,
      city,
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
    ] = line.split('\t');

    return {
      title,
      description,
      date: new Date(date),
      city: city as OfferCity,
      previewUrl,
      images: this.parseImages(images),
      isPremium: this.parseToBoolean(isPremium as BooleanString),
      isFavorite: this.parseToBoolean(isFavorite as BooleanString),
      rating: this.parseToNumber(rating),
      type: type as OfferHousing,
      rooms: this.parseToNumber(rooms),
      guests: this.parseToNumber(guests),
      price: this.parseToNumber(price),
      facilities: this.parseFacilities(facilities),
      user: this.parseUser(user),
      comments: this.parseToNumber(comments),
      location: this.parseLocation(location)
    };
  }

  private parseImages(imagesString: string): string[] {
    return imagesString.split(';');
  }

  private parseFacilities(facilitiesString: string): OfferFacility[] {
    return facilitiesString.split(';') as OfferFacility[];
  }

  private parseUser(userString: string): User {
    const [name, email, avatarUrl, password, type] = userString.split(';');

    return { name, email, avatarUrl, password, type } as User;
  }

  private parseLocation(locationString: string): OfferLocation {
    const [latitude, longitude] = locationString.split(';');

    return {latitude: this.parseToNumber(latitude), longitude: this.parseToNumber(longitude) };
  }

  private parseToBoolean(booleanString: BooleanString): boolean {
    return booleanString === 'true';
  }

  private parseToNumber(numberString: string): number {
    return Number.parseInt(numberString, 10);
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}

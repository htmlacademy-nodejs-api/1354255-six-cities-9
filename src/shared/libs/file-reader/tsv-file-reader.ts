import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';

import {
  Offer,
  OfferCity,
  OfferFacility,
  OfferHousing,
  OfferLocation,
  UserWithPassword
} from '../../types/index.js';
import { FileReaderEvent } from './file-reader-events.js';
import { FileReader } from './file-reader.interface.js';

type BooleanString = 'true' | 'false';

export class TSVFileReader extends EventEmitter implements FileReader {
  private readonly CHUNK_SIZE = 16384; // 16KB

  constructor(private readonly filename: string) {
    super();
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

  private parseUser(userString: string): UserWithPassword {
    const [name, email, avatarUrl, password, type] = userString.split(';');

    return { name, email, avatarUrl, password, type } as UserWithPassword;
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

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);

        await new Promise((resolve) => {
          this.emit(FileReaderEvent.LINE, parsedOffer, resolve);
        });
      }
    }

    this.emit(FileReaderEvent.END, importedRowCount);
  }
}

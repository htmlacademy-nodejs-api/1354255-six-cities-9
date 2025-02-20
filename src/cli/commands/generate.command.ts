import got from 'got';

import { TSVFileWriter } from '../../shared/libs/file-writer/index.js';
import { ConsoleLogger } from '../../shared/libs/logger/console.logger.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { MockServerData } from '../../shared/types/index.js';
import { Command } from '../consts.js';
import { Command as CommandInterface } from './command.interface.js';

export class GenerateCommand implements CommandInterface {
  private initialData: MockServerData;
  private logger: Logger;

  constructor() {
    this.logger = new ConsoleLogger();
  }

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }

  public getName(): string {
    return Command.GENERATE;
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filepath, offerCount);

      this.logger.info(`File ${filepath} was created!`);
    } catch (err) {
      this.logger.error('Can\'t generate data', err as Error);
    }
  }
}

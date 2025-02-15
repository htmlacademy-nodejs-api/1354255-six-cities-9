import { getErrorMessage } from '../../shared/helpers/index.js';
import { FileReaderEvent, TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Offer } from '../../shared/types/index.js';
import { Command } from '../consts.js';
import { Log } from '../helpers/log.helper.js';
import { Command as CommandInterface } from './command.interface.js';

export class ImportCommand implements CommandInterface {
  private onImportedOffer(offer: Offer): void {
    Log.data(offer);
  }

  private onCompleteImport(count: number) {
    Log.info(`${count} rows imported.`);
  }

  public getName(): string {
    return Command.IMPORT;
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on(FileReaderEvent.LINE, this.onImportedOffer);
    fileReader.on(FileReaderEvent.END, this.onCompleteImport);

    try {
      fileReader.read();
    } catch (err) {
      Log.error(`Can't import data from file: ${filename}`);
      Log.error(getErrorMessage(err));
    }
  }
}

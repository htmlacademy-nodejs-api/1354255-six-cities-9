import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Command } from '../consts.js';
import { Log } from '../helpers/log.helper.js';
import { Command as CommandInterface } from './command.interface.js';

export class ImportCommand implements CommandInterface {
  public getName(): string {
    return Command.IMPORT;
  }

  public execute(...parameters: string[]): void {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    try {
      fileReader.read();

      Log.data(fileReader.toArray());
    } catch (err) {

      if (!(err instanceof Error)) {
        throw err;
      }

      Log.error(`Can't import data from file: ${filename}`);
      Log.error(`Details: ${err.message}`);
    }
  }
}

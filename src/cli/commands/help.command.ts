import { Command } from '../consts.js';
import { getCLIDescription } from '../helpers/get-cli-description.js';
import { Log } from '../helpers/log.helper.js';
import { Command as CommandInterface } from './command.interface.js';

export class HelpCommand implements CommandInterface {
  public getName(): string {
    return Command.HELP;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    Log.info(getCLIDescription());
  }
}

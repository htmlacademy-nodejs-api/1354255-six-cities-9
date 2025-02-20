import { ConsoleLogger } from '../../shared/libs/logger/console.logger.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { Command } from '../consts.js';
import { getCLIDescription } from '../helpers/get-cli-description.js';
import { Command as CommandInterface } from './command.interface.js';

export class HelpCommand implements CommandInterface {
  private logger: Logger;

  constructor() {
    this.logger = new ConsoleLogger();
  }

  public getName(): string {
    return Command.HELP;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    this.logger.info(getCLIDescription());
  }
}

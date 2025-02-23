import { getErrorMessage } from '../../helpers/index.js';
import { styleError } from '../../helpers/style-error.js';
import { Logger } from './logger.interface.js';

export class ConsoleLogger implements Logger {
  public debug(message: string, ...args: unknown[]): void {
    console.debug(message, ...args);
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    console.error(styleError(message), ...args);
    console.error(styleError(`Error message: ${getErrorMessage(error)}`));
  }

  public info(message: string, ...args: unknown[]): void {
    console.info(message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    console.warn(message, ...args);
  }
}

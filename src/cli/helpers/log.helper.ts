import chalk from 'chalk';

const styleError = chalk.red.bold;

export class Log {
  static info(message: string) {
    console.info(message);
  }

  static data(data: unknown) {
    console.log(data);
  }

  static error(message: string) {
    console.error(styleError(message));
  }
}

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { Logger } from '../../shared/libs/logger/index.js';
import { Command } from '../consts.js';
import { Command as CommandInterface } from './command.interface.js';

type PackageJSONConfig = {
  version: string;
}

function isPackageJSONConfig(value: unknown): value is PackageJSONConfig {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.hasOwn(value, 'version')
  );
}

export class VersionCommand implements CommandInterface {


  constructor(
    private readonly filePath: string = 'package.json',
    private logger: Logger
  ) {}

  private readVersion(): string {
    const jsonContent = readFileSync(resolve(this.filePath), { encoding: 'utf-8' });
    const importedContent: unknown = JSON.parse(jsonContent);

    if (!isPackageJSONConfig(importedContent)) {
      throw new Error('Failed to parse json content.');
    }

    return importedContent.version;
  }

  public getName(): string {
    return Command.VERSION;
  }

  public async execute(..._parameters: string[]): Promise<void> {
    try {
      const version = this.readVersion();

      this.logger.info(version);
    } catch (err) {
      this.logger.error(`Failed to read version from ${this.filePath}`, err as Error);
    }
  }
}

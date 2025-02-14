#!/usr/bin/env node
import { readdirSync } from 'node:fs';

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMMANDS_DIR } from './cli/consts.js';
import { isCommandConstructor } from './cli/helpers/is-command-constructor.js';
import { Log } from './cli/helpers/log.helper.js';
import { CLIApp } from './cli/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filenames = readdirSync(join(__dirname, COMMANDS_DIR));
const commandFiles = filenames.filter((file) => file.includes('command.ts')).map((file) => join(__dirname, COMMANDS_DIR, file));

const loadCommandInstances = async () => {
  try {
    const modules = await Promise.all(
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      commandFiles.map((path) => import(path))
    );

    const instances = modules.map((moduleExports) => {
      const exports = Object.values(moduleExports);
      const exportedClass = exports.find(isCommandConstructor);

      if (exportedClass) {
        return new exportedClass();
      } else {
        throw new Error('Module does not export a class.');
      }
    });

    return instances;
  } catch (err) {
    if (err instanceof Error) {
      Log.error(err.message);
    }

    throw err;
  }
};

async function bootstrap() {
  const cliApp = new CLIApp();

  const commands = await loadCommandInstances();

  cliApp.registerCommands(commands);

  cliApp.processCommand(process.argv);
}

bootstrap();

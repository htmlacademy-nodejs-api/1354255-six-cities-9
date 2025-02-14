import chalk from 'chalk';

import { Command } from '../consts.js';

type CommandType = typeof Command[keyof typeof Command];

type ExampleLine = {
  file: string;
  command: string;
  args: string;
}

type CommandsLine = {
  command: CommandType;
  args?: string;
  comment: string;
}

type MessageLine<T> = {
  Title: string,
  Line: T,
}

const isLineExample = (line: ExampleLine | CommandsLine): line is ExampleLine => Object.hasOwn(line, 'file');

const START_LINE_LENGTH = 26;
const SEPARATOR_WITHOUT_ARGS_LENGTH = -1;
const DESCRIPTION = 'Программа для подготовки данных для REST API сервера.';

const styleTitle = chalk.bold;
const styleCommand = chalk.green;
const styleArguments = chalk.blue;
const styleComments = chalk.dim;

const ExampleMessage: MessageLine<ExampleLine> = {
  Title: 'Пример:',
  Line: {
    file: 'main.cli.js',
    command: '--<command>',
    args: '[--arguments]'
  },
};

const CommandsMessage: MessageLine<CommandsLine[]> = {
  Title: 'Команды:',
  Line: [
    {
      command: Command.VERSION,
      comment: '# выводит номер версии'
    },
    {
      command: Command.HELP,
      comment: '# печатает этот текст'
    },
    {
      command: Command.IMPORT,
      args: '<path>',
      comment: '# импортирует данные из TSV'
    },
    {
      command: Command.GENERATE,
      args: '<n> <path> <url>',
      comment: '# генерирует произвольное количество тестовых данных'
    },
  ]
};

const getSeparator = (...args: number[]) => {
  const sum = args.reduce((acc, arg) => acc + arg, 0);
  const separatorsCount = START_LINE_LENGTH - sum;

  return ''.padStart(separatorsCount);
};

const styleExample = (line: ExampleLine | CommandsLine) => {
  let prefix = '';
  let postfix = '';
  let args = '';
  let separator = '';

  if (isLineExample(line)) {
    prefix = `${line.file} `;
  } else {
    const argsLength = line.args?.length ?? SEPARATOR_WITHOUT_ARGS_LENGTH;

    postfix = ` ${line.comment}`;
    separator = `: ${getSeparator(line.command.length, argsLength)}`;
  }

  if (line.args) {
    args = ` ${styleArguments(line.args)}`;
  }

  return `${prefix}${styleCommand(line.command)}${args}${separator}${styleComments(postfix)}`;
};

const getCommandsMessage = () => CommandsMessage.Line.map((line) => styleExample(line)).join('\n  ');

export const getCLIDescription = () => (`
  ${DESCRIPTION}

  ${styleTitle(ExampleMessage.Title)} ${styleExample(ExampleMessage.Line)}

  ${styleTitle(CommandsMessage.Title)}

  ${getCommandsMessage()}
`);

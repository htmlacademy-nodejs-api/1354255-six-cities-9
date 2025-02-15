import { CommandParser } from './command-parser.js';
import { Command as CommandInterface } from './commands/command.interface.js';
import { Command } from './consts.js';

type CommandCollection = Record<string, CommandInterface>;

export class CLIApp {
  private commands: CommandCollection = {};

  constructor(private readonly defaultCommand: string = Command.HELP) {}

  public registerCommands(commandList: CommandInterface[]): void {
    commandList.forEach((command) => {
      if (Object.hasOwn(this.commands, command.getName())) {
        throw new Error(`Command ${command.getName()} is already registered`);
      }

      this.commands[command.getName()] = command;
    });
  }

  public getCommand(commandName: string): CommandInterface {
    return this.commands[commandName] ?? this.getDefaultCommand();
  }

  public getDefaultCommand(): CommandInterface | never {
    if (!this.commands[this.defaultCommand]) {
      throw new Error(`The default command (${this.defaultCommand}) is not registered.`);
    }

    return this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];

    command.execute(...commandArguments);
  }
}

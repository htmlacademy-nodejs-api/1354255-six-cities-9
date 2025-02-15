import { Command } from '../../cli/consts.js';

export type CommandType = typeof Command[keyof typeof Command];

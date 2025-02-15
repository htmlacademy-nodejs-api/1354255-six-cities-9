import { Command } from '../commands/command.interface.js';

export const isCommandConstructor = (obj: unknown): obj is new () => Command => {
  if (typeof obj !== 'function' || !obj.prototype) {
    return false;
  }

  const prototype = obj.prototype;

  return (
    typeof prototype.getName === 'function' &&
    typeof prototype.execute === 'function'
  );
};

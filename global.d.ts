import { TokenPayload } from './src/shared/types/index.ts';

declare module 'express-serve-static-core' {
  export interface Request {
    tokenPayload: TokenPayload;
  }
}

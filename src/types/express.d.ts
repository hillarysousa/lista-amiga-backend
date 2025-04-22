import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

declare module 'express' {
  export interface Request {
    user?: DecodedIdToken;
  }
}

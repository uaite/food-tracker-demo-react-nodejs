import type { User } from '../shared/types';

export interface AuthVerifyResponse {
  user: User;
}

export interface AuthMeResponse {
  user: User;
}

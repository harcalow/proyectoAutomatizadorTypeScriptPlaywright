import { env } from '../utils/env';

export interface Credentials {
  username: string;
  password: string;
}

export const users = {
  admin: { username: env.user, password: env.password },
  wrongPassword: { username: env.user, password: 'clave123' },
  nonexistentUser: { username: 'noexiste', password: env.password },
  bothWrong: { username: 'noexiste', password: 'clave123' },
} satisfies Record<string, Credentials>;

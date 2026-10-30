import { env } from '../utils/env';

export const users = {
  admin: { username: env.user, password: env.password },
  invalid: { username: 'usuario_invalido', password: 'clave_invalida' },
};

import 'dotenv/config';

export const env = {
  baseUrl: process.env.BASE_URL ?? 'https://opensource-demo.orangehrmlive.com',
  user: process.env.ORANGEHRM_USER ?? 'Admin',
  password: process.env.ORANGEHRM_PASSWORD ?? 'admin123',
};

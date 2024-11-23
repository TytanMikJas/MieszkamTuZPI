import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../../.env.dev') });
const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page }) => {

  const user = 'officialwroclawmp@gmail.com';
  const password = process.env.DEV_PASSWORD ?? '';

  await page.goto('http://localhost:5000/mapa/login');
  await page.getByPlaceholder('Email').fill(user);
  await page.getByPlaceholder('Hasło').fill(password);
  await page.getByRole('button', { name: 'ZALOGUJ SIĘ' }).click();

  await page.waitForURL('http://localhost:5000/mapa/start');

  await page.context().storageState({ path: authFile });
});

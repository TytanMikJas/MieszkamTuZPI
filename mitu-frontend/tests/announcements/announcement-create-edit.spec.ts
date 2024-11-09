import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.resolve(__dirname, '../../public/mitu.png');
const waitingTime = 200;

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000/mapa/ogloszenia');
    await page.waitForTimeout(waitingTime);
});

test('should create announcement', async ({ page }) => {
    await page.getByText('Menu Urzędnika').click();
    await page.getByRole('link', { name: 'Ogłoszenie' }).click();
    await page.getByPlaceholder('Tytuł ogłoszenia').click();
    await page.getByPlaceholder('Tytuł ogłoszenia').fill('Ogloszenie');
    await page.getByPlaceholder('Opis ogłoszenia').click();
    await page.getByPlaceholder('Opis ogłoszenia').fill('Test ogloszenia');
    await page.getByLabel('Kategoria *').click();
    await page.getByLabel('Zaproszenie').click();
    await page.getByPlaceholder('Odpowiedzialny za ogłoszenie *').click();
    await page.getByPlaceholder('Odpowiedzialny za ogłoszenie *').fill('Wroclaw');
    await page.getByLabel('Możliwość komentowania *').click();
    await page.getByLabel('Włączone').click();
    await page.getByLabel('Ulica').click();
    await page.getByLabel('Ulica').fill('Tete');
    await page.getByLabel('Numer budynku').click();
    await page.getByLabel('Numer budynku').fill('1A');
    await page.getByLabel('Miniaturka *').click();
    await page.getByLabel('Miniaturka *').setInputFiles(filePath);
    await page.getByRole('button', { name: 'Lokalizacja' }).click();
    await page.locator('div').filter({ hasText: /^\+− Leaflet \| OSM$/ }).first().click();
    await page.getByRole('button', { name: 'Obszar' }).click();
    await page.locator('div').filter({ hasText: /^\+− Leaflet \| OSM$/ }).first().click();
    await page.locator('div').filter({ hasText: /^\+− Leaflet \| OSM$/ }).first().click();
    await page.locator('div').filter({ hasText: /^\+− Leaflet \| OSM$/ }).first().click();
    await page.locator('div').filter({ hasText: /^\+− Leaflet \| OSM$/ }).first().click();
    await page.getByRole('button', { name: 'add Dodaj ogłoszenie' }).click();
    await expect(page).toHaveURL('http://localhost:5000/mapa/ogloszenia');
});

test('should edit announcement', async ({ page }) => {
    await page.waitForTimeout(waitingTime);
    await page.getByRole('link', { name: 'Ogłoszenia' }).click();
    await page.waitForTimeout(waitingTime);
    await page.getByTestId('announcement-title').first().click();
    await page.getByRole('button', { name: 'Edytuj' }).click();
    await page.getByPlaceholder('Tytuł ogłoszenia').click();
    await page.getByPlaceholder('Tytuł ogłoszenia').fill('Nowe Ogloszenie');
    await page.getByPlaceholder('Opis ogłoszenia').click();
    await page.getByPlaceholder('Opis ogłoszenia').press('ControlOrMeta+a');
    await page.getByPlaceholder('Opis ogłoszenia').fill('nowy opis');
    await page.getByLabel('Kategoria *').click();
    await page.getByLabel('Budowa').click();
    await page.getByPlaceholder('Odpowiedzialny za ogłoszenie *').click();
    await page.getByPlaceholder('Odpowiedzialny za ogłoszenie *').press('ControlOrMeta+a');
    await page.getByPlaceholder('Odpowiedzialny za ogłoszenie *').fill('nowy odp');
    await page.getByLabel('Możliwość komentowania *').click();
    await page.getByLabel('Wyłączone').getByText('Wyłączone').click();
    await page.getByLabel('Ulica').click();
    await page.getByLabel('Ulica').press('ControlOrMeta+a');
    await page.getByLabel('Ulica').fill('nowa');
    await page.getByLabel('Numer budynku').click();
    await page.getByLabel('Numer budynku').fill('n1');
    await page.getByRole('button', { name: 'Obszar' }).click();
    await page.locator('div').filter({ hasText: /^\+− Leaflet \| OSM$/ }).first().click();
    await page.locator('div').filter({ hasText: /^\+− Leaflet \| OSM$/ }).first().click();
    await page.locator('div').filter({ hasText: /^\+− Leaflet \| OSM$/ }).first().click();
    await page.locator('div').filter({ hasText: /^\+− Leaflet \| OSM$/ }).first().click();
    await page.getByRole('button', { name: 'add Edytuj ogłoszenie' }).click();
    await expect(page.locator('h2')).toContainText('Nowe Ogloszenie');
    await expect(page.locator('#root')).toContainText('nowy odp');
    await expect(page.locator('#root')).toContainText('nowy opis');
    await expect(page.locator('#root')).toContainText('nowa n1');
});


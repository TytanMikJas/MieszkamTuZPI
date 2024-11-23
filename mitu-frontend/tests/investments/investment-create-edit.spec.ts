import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.resolve(__dirname, '../../public/mitu.png');
const waitingTime = 200;

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000/mapa/inwestycje');
    await page.waitForTimeout(waitingTime);
});

test('should create investment', async ({ page }) => {
    await page.getByText('Menu Urzędnika').click();
    await page.getByRole('link', { name: 'Inwestycje' }).click();
    await page.getByPlaceholder('Tytuł inwestycji').click();
    await page.getByPlaceholder('Tytuł inwestycji').fill('Test');
    await page.getByPlaceholder('Opis inwestycji').click();
    await page.getByPlaceholder('Opis inwestycji').fill('Opis');
    await page.getByLabel('Kategoria *').click();
    await page.getByLabel('Transport').click();
    await page.getByLabel('Status projektu *').click();
    await page.getByLabel('Zaakceptowane').getByText('Zaakceptowane').click();
    await page.getByPlaceholder('Odpowiedzialny za inwestycję').click();
    await page.getByPlaceholder('Odpowiedzialny za inwestycję').fill('Wroclaw');
    await page.getByLabel('Możliwość komentowania').click();
    await page.getByLabel('Włączone').click();
    await page.getByPlaceholder('Wybierz odznaki...').click();
    await page.getByRole('option', { name: 'Eko projekt' }).click();
    await page.getByRole('option', { name: 'Przyjazne niepełnosprawnym' }).click();
    await page.getByRole('option', { name: 'Przyjazne rodzinom' }).click();
    await page.getByLabel('Miniaturka').click();
    await page.getByLabel('Miniaturka').setInputFiles(filePath);
    await page.getByRole('button', { name: 'Lokalizacja' }).click();
    await page.locator('div').filter({ hasText: /^\+− Leaflet \| OSM$/ }).first().click();
    await page.getByRole('button', { name: 'Obszar' }).click();
    await page.locator('div').filter({ hasText: /^\+− Leaflet \| OSM$/ }).first().click();
    await page.locator('div').filter({ hasText: /^\+− Leaflet \| OSM$/ }).first().click();
    await page.locator('div').filter({ hasText: /^\+− Leaflet \| OSM$/ }).first().click();
    await page.locator('div').filter({ hasText: /^\+− Leaflet \| OSM$/ }).first().click();
    await page.getByRole('button', { name: 'add Dodaj inwestycję' }).click();
    await expect(page).toHaveURL('http://localhost:5000/mapa/inwestycje');
});



test('should edit investment', async ({ page }) => {
    await page.getByRole('link', { name: 'Inwestycje' }).click();
    await page.goto('http://localhost:5000/mapa/inwestycje');
    await page.getByTestId('investments-list').getByRole('img').first().click();
    await page.getByRole('button', { name: 'edit Edytuj' }).click();
    await page.getByPlaceholder('Tytuł inwestycji').click();
    await page.getByPlaceholder('Tytuł inwestycji').press('ControlOrMeta+a');
    await page.getByPlaceholder('Tytuł inwestycji').fill('Nowy tytul');
    await page.getByPlaceholder('Tytuł inwestycji').press('ControlOrMeta+a');
    await page.getByPlaceholder('Opis inwestycji').click();
    await page.getByPlaceholder('Opis inwestycji').press('ControlOrMeta+a');
    await page.getByPlaceholder('Opis inwestycji').fill('Nowy Opis');
    await page.getByLabel('Kategoria *').click();
    await page.getByLabel('Edukacja').getByText('Edukacja').click();
    await page.getByLabel('Status projektu *').click();
    await page.getByLabel('Zakończone').getByText('Zakończone').click();
    await page.getByPlaceholder('Odpowiedzialny za inwestycję').click();
    await page.getByPlaceholder('Odpowiedzialny za inwestycję').press('ControlOrMeta+a');
    await page.getByPlaceholder('Odpowiedzialny za inwestycję').fill('Kotek');
    await page.getByPlaceholder('Odpowiedzialny za inwestycję').press('ControlOrMeta+a');
    await page.getByPlaceholder('Odpowiedzialny za inwestycję').fill('Test');
    await page.getByLabel('Ulica').click();
    await page.getByLabel('Ulica').click();
    await page.getByLabel('Ulica').click();
    await page.getByLabel('Ulica').fill('Nowa');
    await page.getByLabel('Numer domu').click();
    await page.getByLabel('Numer domu').fill('2');
    await page.getByLabel('Numer mieszkania').click();
    await page.getByLabel('Numer mieszkania').fill('31A');
    await page.getByRole('button', { name: 'add Edytuj inwetycję' }).click();
    await expect(page.locator('h2')).toContainText('Nowy tytul');
    await expect(page.getByTestId('icon-label-text').nth(0)).toContainText('Test');
    await expect(page.getByTestId('icon-label-text').nth(1)).toContainText('Edukacja');
    await expect(page.getByTestId('icon-label-text').nth(3)).toContainText('Nowa 2/31A');
    await expect(page.getByTestId('investment-content')).toContainText('Nowy Opis');
});


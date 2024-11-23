import { test, expect } from '@playwright/test';

const waitingTime = 200;

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000/mapa/inwestycje');
    await page.waitForTimeout(waitingTime);
});

test('should go to official page, save and delete comment', async ({ page }) => {
    await page.getByText('Menu Urzędnika').click();
    await page.getByRole('link', { name: 'Zarządzaj komentarzami' }).click();
    await expect(page.getByText('constructionKreator inwestycji')).toBeVisible();
    await expect(page.getByText('constructionKreator ogłoszeń')).toBeVisible();
    await expect(page.getByText('constructionKreator nieruchomości')).toBeVisible();
    await expect(page.getByText('mailPanel newsletterów')).toBeVisible();
    await page.waitForTimeout(waitingTime);
    await page.locator('.flex > div:nth-child(2) > div').first().click();
    await page.waitForTimeout(waitingTime);
    await expect(page.getByText('Pomyślnie zedytowano status')).toBeVisible();
    await page.waitForTimeout(waitingTime);
    await page.locator('.flex > div:nth-child(2) > div:nth-child(2)').first().click();
    await page.waitForTimeout(waitingTime);
    await expect(page.getByText('Pomyślnie usunięto komentarz')).toBeVisible();
});
import { test, expect, type Page } from '@playwright/test';

const waitingTime = 200;

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000');
    await page.waitForTimeout(waitingTime);
});

test.describe('Navigate thorugh icons', () => {
    test('should check all landing page cards', async ({ page }) => {
        await page.getByRole('tab', { name: 'Inwestycje' }).click();
        await expect(page.getByText('Witryna Inwestycje oferuje')).toBeVisible();
        await page.getByRole('tab', { name: 'Nieruchomości' }).click();
        await expect(page.getByText('Witryna Nieruchomości to')).toBeVisible();
        await page.getByRole('tab', { name: 'Ogłoszenia' }).click();
        await expect(page.getByText('Witryna Ogłoszenia to oferuje')).toBeVisible();
    });
});

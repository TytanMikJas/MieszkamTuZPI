import { test, expect } from '@playwright/test';

const waitingTime = 200;

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000/mapa/inwestycje');
    await page.waitForTimeout(waitingTime);
});

test ('Should filter the investments', async ({ page }) => {
    await page.getByTestId('investments-filter').click();
    await page.getByRole('menuitemcheckbox', { name: 'W trakcie' }).click();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(waitingTime);

    await expect(page.getByTestId('icon-label-text').nth(2)).toContainText('W trakcie');

    await page.getByTestId('investments-filter').click();
    await page.getByRole('menuitemcheckbox', { name: 'Zakończone' }).click();
    await page.getByRole('menuitemcheckbox', { name: 'W trakcie' }).click();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(waitingTime);
    
    await expect(page.getByTestId('icon-label-text').nth(2)).toContainText('Zakończone');
});

test ('Should sort the investments', async ({ page }) => {
    await page.getByTestId('investments-sort').click();
    await page.getByRole('menuitemradio', { name: 'Najlepsze' }).click();
    await page.waitForTimeout(waitingTime);
    const highestRating = parseFloat(await page.getByTestId('rating-count').nth(0).textContent() ?? '0');
    const secondHighestRating = parseFloat(await page.getByTestId('rating-count').nth(1).textContent() ?? '0');
    
    expect(highestRating).toBeGreaterThanOrEqual(secondHighestRating);

    await page.getByTestId('investments-sort').click();
    await page.getByRole('menuitemradio', { name: 'Najgorsze' }).click();
    await page.waitForTimeout(waitingTime);
    const lowestRating = parseFloat(await page.getByTestId('rating-count').nth(0).textContent() ?? '0');
    const secondLowestRating = parseFloat(await page.getByTestId('rating-count').nth(1).textContent() ?? '0');
    
    expect(lowestRating).toBeLessThanOrEqual(secondLowestRating);
});
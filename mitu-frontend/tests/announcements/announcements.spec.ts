import { test, expect } from '@playwright/test';

const waitingTime = 200;

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000/mapa/ogloszenia');
    await page.waitForTimeout(waitingTime);
});


test ('Should sort the announcements', async ({ page }) => {
    await page.getByTestId('announcements-sort').click();
    await page.getByRole('menuitemradio', { name: 'Najlepsze' }).click();
    await page.waitForTimeout(waitingTime);

    const highestRating = parseFloat(await page.getByTestId('rating-count').nth(0).textContent() ?? '0');
    const secondHighestRating = parseFloat(await page.getByTestId('rating-count').nth(1).textContent() ?? '0');
    expect(highestRating).toBeGreaterThanOrEqual(secondHighestRating);

    await page.getByTestId('announcements-sort').click();
    await page.getByRole('menuitemradio', { name: 'Najgorsze' }).click();
    await page.waitForTimeout(waitingTime);

    const lowestRating = parseFloat(await page.getByTestId('rating-count').nth(0).textContent() ?? '0');
    const secondLowestRating = parseFloat(await page.getByTestId('rating-count').nth(1).textContent() ?? '0');
    expect(lowestRating).toBeLessThanOrEqual(secondLowestRating);
});
import { test, expect } from '@playwright/test';

const waitingTime = 200;

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000/mapa/inwestycje');
    await page.waitForTimeout(waitingTime);
});

test('should rate investments in all possible ways', async ({ page }) => {
    await page.getByRole('link', { name: 'Inwestycje' }).click();
    await page.goto('http://localhost:5000/mapa/inwestycje');
    await page.waitForTimeout(waitingTime);

    const minusIconChildHasClass = (await page.getByTestId('minus-icon').first()
    .locator('button')
    .getAttribute('class'))?.includes('bg-blue-200 rounded-full');
    
    const plusIconChildHasClass = (await page.getByTestId('plus-icon').first()
    .locator('button')
    .getAttribute('class'))?.includes('bg-red-200 rounded-full');

    await page.waitForTimeout(waitingTime);

    if (minusIconChildHasClass) {
        await page.getByTestId('minus-icon').first().click();
    } else if (plusIconChildHasClass) {
        await page.getByTestId('plus-icon').first().click();
    };

    await page.waitForTimeout(waitingTime);
    const currentRating = parseFloat(await page.getByTestId('rating-count').nth(0).textContent() ?? '0');
    await page.waitForTimeout(waitingTime);
    await page.getByTestId('minus-icon').first().click();
    await page.waitForTimeout(waitingTime);
    await expect(page.getByTestId('rating-count').nth(0)).toContainText((currentRating - 1).toString());
    await page.getByTestId('minus-icon').first().click();
    await page.waitForTimeout(waitingTime);
    await expect(page.getByTestId('rating-count').nth(0)).toContainText(currentRating.toString());
    await page.getByTestId('plus-icon').first().click();
    await page.waitForTimeout(waitingTime);
    await expect(page.getByTestId('rating-count').nth(0)).toContainText((currentRating + 1).toString());
    await page.getByTestId('plus-icon').first().click();
    await page.waitForTimeout(waitingTime);
    await expect(page.getByTestId('rating-count').nth(0)).toContainText(currentRating.toString());
    await page.getByTestId('plus-icon').first().click();
    await page.waitForTimeout(waitingTime);
    await page.getByTestId('minus-icon').first().click();
    await page.waitForTimeout(waitingTime);
    await expect(page.getByTestId('rating-count').nth(0)).toContainText((currentRating - 1).toString());
    await page.getByTestId('plus-icon').first().click();
    await page.waitForTimeout(waitingTime);
    await expect(page.getByTestId('rating-count').nth(0)).toContainText((currentRating + 1).toString());
    await page.getByTestId('plus-icon').first().click();
    await page.waitForTimeout(waitingTime);
});
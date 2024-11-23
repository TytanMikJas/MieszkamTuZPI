import { test, expect } from '@playwright/test';

const waitingTime = 200;

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000/mapa/inwestycje');
    await page.waitForTimeout(waitingTime);
});

test('should create and delete comment and subcomment', async ({ page }) => {
    await page.waitForTimeout(waitingTime);
    await page.goto('http://localhost:5000/mapa/inwestycje');
    await page.waitForTimeout(waitingTime);
    await page.getByRole('link', { name: 'Inwestycje' }).click();
    await page.waitForTimeout(waitingTime);
    await page.getByTestId('investments-list').getByRole('img').first().click();
    await page.waitForTimeout(waitingTime);
    await page.getByPlaceholder('Napisz komentarz...').click();
    await page.getByPlaceholder('Napisz komentarz...').fill('Test komentarza');
    await page.waitForTimeout(waitingTime);
    await page.getByTestId('send-icon').click();
    await page.getByRole('button', { name: 'Odpowiedz' }).click();
    await page.getByPlaceholder('Napisz komentarz...').click();
    await page.getByPlaceholder('Napisz komentarz...').fill('Test podkomentarza');
    await page.getByTestId('send-icon').click();
    await expect(page.getByTestId('comment-content').nth(0)).toContainText('Test komentarza');
    await expect(page.getByTestId('comment-content').nth(1)).toContainText('Test podkomentarza');
    await expect(page.locator('.space-y-2 > .bg-white > div:nth-child(2)')).toBeVisible();

    await page.getByText('delete').nth(1).click();
    await page.getByRole('button', { name: 'Usuń' }).click();
    await expect(page.locator('.space-y-2 > .bg-white > div:nth-child(2)')).not.toBeVisible();
});

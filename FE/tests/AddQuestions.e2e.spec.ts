import { test, expect } from '@playwright/test';

test.describe('AddQuestions Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/add');
  });

  test('should submit the form successfully with valid data', async ({ page }) => {
    await page.fill('input[name="question"]', 'What is the capital of France?');

    const optionSelectors = await page.locator('input[placeholder^="Option"]').all();
    await optionSelectors[0].fill('Paris');
    await optionSelectors[1].fill('London');
    await optionSelectors[2].fill('Berlin');
    await optionSelectors[3].fill('Madrid');

    await page.fill('input[name="correctAnswer"]', 'Paris');
    await page.fill('input[name="category"]', 'Geography');
    await page.fill('input[name="difficulty"]', 'Easy');

    await page.click('button[type="submit"]');

    const successMessage = page.locator('text=Question added successfully!');
    await expect(successMessage).toBeVisible();
  });

  test('should show error message when API fails', async ({ page }) => {
    await page.route('**/questions', route =>
      route.abort('failed')
    );

    await page.fill('input[name="question"]', 'Dummy question');
    const optionSelectors = await page.locator('input[placeholder^="Option"]').all();
    await optionSelectors[0].fill('A');
    await optionSelectors[1].fill('B');
    await optionSelectors[2].fill('C');
    await optionSelectors[3].fill('D');

    await page.fill('input[name="correctAnswer"]', 'A');
    await page.fill('input[name="category"]', 'Test');
    await page.fill('input[name="difficulty"]', 'Medium');

    await page.click('button[type="submit"]');

    const errorMessage = page.locator('text=Error adding question');
    await expect(errorMessage).toBeVisible();
  });
});

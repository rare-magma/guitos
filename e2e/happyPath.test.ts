/* eslint-disable testing-library/prefer-screen-queries */
import { expect, test } from "@playwright/test";

test("should complete the happy path", async ({ page, isMobile }) => {
  await page.goto("/");

  // should show landing page
  await expect(page.getByText("get started")).toBeVisible();
  await expect(page.getByText("help")).toBeVisible();

  // should create new budget
  await page.getByText("get started").click();

  await expect(page.getByText("Statistics")).toBeVisible();
  await expect(page.getByText("Revenue")).toBeVisible();
  await expect(page.getByText("Expenses")).toBeVisible();

  // should create new incomes
  await page.locator("#Revenue-1-name").click();
  await page.locator("#Revenue-1-name").fill("salary");

  await expect(page.locator("#Revenue-1-name")).toHaveValue("salary");

  await page.locator("#Revenue-1-value").click();
  await page.locator("#Revenue-1-value").fill("1000");
  await page.locator("#Revenue-1-name").click();

  await expect(page.locator("#Revenue-1-value")).toHaveValue("$1,000");

  await page.getByLabel("add item to Revenue").click();
  await page.getByLabel("item 2 name").fill("sale");
  await page.getByLabel("item 2 name").press("Tab");
  await page.getByLabel("item 2 value").fill("50");
  await page.getByLabel("item 2 value").press("Tab");

  await expect(page.getByLabel("item 2 name")).toHaveValue("sale");
  await expect(page.getByLabel("item 2 value")).toHaveValue("$50");

  await page.locator("#Revenue-2-operate-button").press("Tab");
  await page.getByLabel("delete item 2").press("Tab");
  await page.getByLabel("add item to Revenue").press("Enter");
  await page.getByLabel("item 3 name").fill("bonus");
  await page.getByLabel("item 3 name").press("Tab");
  await page.getByLabel("item 3 value").fill("25");
  await page.getByLabel("item 3 value").press("Tab");
  await page.locator("#Revenue-3-operate-button").press("Enter");
  await page.getByLabel("add", { exact: true }).fill("10");
  await page.getByLabel("add", { exact: true }).press("Enter");

  await expect(page.getByLabel("item 3 name")).toHaveValue("bonus");
  await expect(page.getByLabel("item 3 value")).toHaveValue("$35");

  // should create new expenses
  await page.locator("#Expenses-1-name").click();
  await page.locator("#Expenses-1-name").fill("rent");
  await page.locator("#Expenses-1-name").press("Tab");
  await page.locator("#Expenses-1-value").fill("500.75");
  await page.locator("#Expenses-1-value").press("Tab");
  await page.locator("#Expenses-1-operate-button").press("Tab");
  await page.locator("#delete-Expenses-1-button").press("Tab");

  await expect(page.locator("#Expenses-1-name")).toHaveValue("rent");
  await expect(page.locator("#Expenses-1-value")).toHaveValue("$500.75");

  await page.getByLabel("add item to Expenses").press("Enter");
  await page.locator("#Expenses-2-name").fill("groceries");
  await page.locator("#Expenses-2-name").press("Tab");
  await page.locator("#Expenses-2-value").fill("100");
  await page.locator("#Expenses-2-value").press("Tab");
  await page.locator("#Expenses-2-operate-button").press("Tab");
  await page.locator("#delete-Expenses-2-button").press("Tab");

  await expect(page.locator("#Expenses-2-name")).toHaveValue("groceries");
  await expect(page.locator("#Expenses-2-value")).toHaveValue("$100");

  await page.getByLabel("add item to Expenses").press("Enter");
  await page.locator("#Expenses-3-name").fill("item");
  await page.locator("#Expenses-3-name").press("Tab");
  await page.locator("#Expenses-3-value").fill("50");

  await expect(page.locator("#Expenses-3-name")).toHaveValue("item");
  await expect(page.locator("#Expenses-3-value")).toHaveValue("$50");

  await page.locator("#Expenses-3-operate-button").click();
  await page.getByLabel("select type of operation on").click();
  await page.getByLabel("subtraction").click();
  await page.getByLabel("subtract", { exact: true }).click();
  await page.getByLabel("subtract", { exact: true }).fill("50");
  await page.getByLabel("apply change to item value").click();

  await expect(page.locator("#Expenses-3-value")).toHaveValue("$0");

  await page.getByLabel("add item to Expenses").click();
  await page.getByLabel("item 4 name").fill("mistake");
  await page.getByLabel("item 4 value").click();
  await page.getByLabel("item 4 value").fill("20");
  await expect(page.locator("#Expenses-4-name")).toHaveValue("mistake");
  await expect(page.locator("#Expenses-4-value")).toHaveValue("$20");

  await page.getByLabel("delete item 4").click();
  await page.getByLabel("confirm item 4 deletion").click();

  await expect(page.locator("#Expenses-4-name")).not.toBeVisible();
  await expect(page.locator("#Expenses-4-value")).not.toBeVisible();

  // should undo changes
  if (isMobile) {
    await page.getByLabel("Toggle navigation").click();
    await expect(page.locator("#offcanvasNavbarLabel-expand-md")).toBeVisible();
  }

  await page.getByLabel("undo change").click();

  await expect(page.locator("#Expenses-4-name")).toHaveValue("mistake");
  await expect(page.locator("#Expenses-4-value")).toHaveValue("$20");

  // should handle statistics changes
  await page.getByLabel("reserves").click();
  await page.getByLabel("reserves").fill("2000");

  await expect(page.locator("#reserves")).toHaveValue("$2,000");
  await expect(page.getByLabel("available", { exact: true })).toHaveValue(
    "$464.25",
  );
  await expect(page.locator("#with-goal")).toHaveValue("$355.75");
  await expect(page.locator("#saved")).toHaveValue("$108.5");

  await page.getByLabel("calculate savings goal").click();

  await expect(page.getByLabel("available", { exact: true })).toHaveValue(
    "$464.25",
  );
  await expect(page.locator("#with-goal")).toHaveValue("$0");
  await expect(page.locator("#saved")).toHaveValue("$464.25");

  // should handle budget changes
  await page.getByLabel("budget name").fill("2024-01");
  await expect(page.getByLabel("budget name")).toHaveValue("2024-01");

  if (isMobile) {
    await page.getByLabel("Toggle navigation").click();
  }

  await page.getByLabel("new budget").click();

  await expect(page.getByLabel("go to older budget")).toBeVisible();
  await expect(page.getByLabel("budget name")).not.toHaveValue("2024-01");

  if (isMobile) {
    await page.getByLabel("Toggle navigation").click();
  }
  await page.getByLabel("delete budget").click();
  await page.getByLabel("confirm budget deletion").click();

  await expect(page.getByLabel("budget name")).toHaveValue("2024-01");

  if (isMobile) {
    await page.getByLabel("Toggle navigation").click();
  }
  await page.getByLabel("clone budget").click();

  await expect(page.getByLabel("budget name")).toHaveValue("2024-01-clone");

  await page.close();
});

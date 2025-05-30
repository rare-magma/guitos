import fs from "node:fs";
import { expect, test } from "@playwright/test";

const rentRegex = /rent/;
const csvRegex = /.csv/;
const jsonRegex = /.json/;

test("should complete the settings happy path", async ({ page, isMobile }) => {
  await page.goto("/");

  // should show charts page
  await page.getByText("get started").click();
  await page.locator("#Expenses-1-name").click();
  await page.locator("#Expenses-1-name").fill("rent");
  await page.locator("#Expenses-1-name").press("Tab");
  await page.locator("#Expenses-1-value").fill("500.75");

  await expect(page.locator("#Expenses-1-name")).toHaveValue("rent");
  await expect(page.locator("#Expenses-1-value")).toHaveValue("$500.75");

  await page.getByLabel("open charts view").click();

  await expect(page.getByText("Revenue vs expenses")).toBeVisible();
  // ensure y chart labels are visible
  await page.getByText("$600.00").hover();
  await page.getByText("12%").hover();
  await expect(page.getByText("Savings", { exact: true })).toBeVisible();
  await expect(page.getByText("Reserves", { exact: true })).toBeVisible();
  await expect(page.getByText("Available vs with goal")).toBeVisible();
  await expect(page.getByText("Savings goal")).toBeVisible();

  await page.getByPlaceholder("Filter...").click();
  await page.getByPlaceholder("Filter...").fill("rent");
  await page.getByLabel(rentRegex).click();

  await page.getByText("strict match").click();
  await expect(page.getByText("Expenses filtered by: rent")).toBeVisible();

  await page.getByLabel("go back to budgets").click();

  await expect(page.getByText("Statistics")).toBeVisible();

  // should handle settings changes
  if (isMobile) {
    await page.getByLabel("Toggle navigation").click();
  }
  await page.getByLabel("budget settings").click();
  await page.getByLabel("select display currency").click();
  await page.getByLabel("select display currency").fill("eur");
  await page.getByLabel("EUR").click();

  await expect(page.getByText("€0.00")).toBeVisible();

  await page.getByLabel("import or export budget").click();
  await expect(page.getByText("csv")).toBeVisible();

  // should handle downloads
  const csvDownloadPromise = page.waitForEvent("download");
  await page.getByLabel("export budget as csv").click();
  const csvDownload = await csvDownloadPromise;
  expect(csvDownload.suggestedFilename()).toMatch(csvRegex);
  expect(
    (await fs.promises.stat(await csvDownload.path())).size,
  ).toBeGreaterThan(0);

  await page.getByLabel("import or export budget").click();
  await expect(page.getByText("json")).toBeVisible();

  const [jsonDownload] = await Promise.all([
    page.waitForEvent("download"),
    page.getByLabel("export budget as json").click(),
  ]);

  const downloadError = await jsonDownload.failure();
  if (downloadError !== null) {
    console.log("Error on download:", downloadError);
    throw new Error(downloadError);
  }

  expect(jsonDownload.suggestedFilename()).toMatch(jsonRegex);
  expect(
    (await fs.promises.stat(await jsonDownload.path())).size,
  ).toBeGreaterThan(0);

  // should handle import
  await expect(page.getByLabel("import or export budget")).toBeVisible();
  await page.getByLabel("import or export budget").click();
  await page
    .getByTestId("import-form-control")
    .setInputFiles("./docs/guitos-sample.json");

  await page.getByLabel("go to newer budget").click({ force: true });

  if (isMobile) {
    await page.getByLabel("Toggle navigation").click();
  }

  await expect(
    page.getByRole("combobox", { name: "search in budgets" }),
  ).toBeVisible();

  await expect(page.getByLabel("budget name")).toHaveValue("2023-06");

  await page.close();
});

import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("");

  await expect(page.getByText(/Welcome to Osaan/i)).toBeVisible();
});

test("admin can sign in and see skills list", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Manage Competences" }).click();

  await page.getByRole("button", { name: "Sign in with Keycloak" }).click();

  const usernameField = page
    .getByLabel(/^username or email$/i)
    .or(page.locator("input#username"));
  await expect(usernameField).toBeVisible({ timeout: 30_000 });

  await usernameField.fill("admin");

  const passwordField = page
    .getByLabel(/^password$/i)
    .or(page.locator("input#password"));
  await passwordField.fill("admin");

  await page
    .locator("#kc-login")
    .or(page.getByRole("button", { name: /^sign in$/i }))
    .click();

  const skillsGridItems = page.locator("main .grid > div");
  await expect(skillsGridItems).toHaveCount(20, { timeout: 30_000 });

  await expect(page.getByRole("heading", { name: "agile" })).toBeVisible({
    timeout: 30_000,
  });
});

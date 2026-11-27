import { test, expect } from "@playwright/test";

// osaan-ui renders in Finnish or English depending on the saved language,
// so every text match accepts both.
const signInWithKeycloak = /sign in with keycloak|kirjaudu keycloakilla/i;
const mySkills = /^(my skills|osaamiseni)$/i;
const signOut = /^(sign out|kirjaudu ulos)$/i;

test("home page offers sign-in with Keycloak", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("button", { name: signInWithKeycloak }).first()
  ).toBeVisible();
});

test("a user can sign in and sees their competence profile", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: signInWithKeycloak }).first().click();

  // Seeded user: the username is also the password.
  const username = page.locator("input#username");
  await expect(username).toBeVisible({ timeout: 30_000 });
  await username.fill("mikko");
  await page.locator("input#password").fill("mikko");
  await page.locator("#kc-login").click();

  await expect(page).toHaveURL(/\/competences/, { timeout: 30_000 });
  await expect(page.getByRole("heading", { name: mySkills })).toBeVisible();
  await expect(page.getByRole("button", { name: signOut })).toBeVisible();
});

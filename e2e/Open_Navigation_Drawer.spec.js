/* eslint-disable no-undef */
Feature('Navigation Drawer');

const NAV_LINKS = {
  Home: '/#/',
  Favorites: '/#/favorites',
  'About Us': 'https://xlaks.github.io/',
};

Scenario('showing navigation drawer for mobile view', async ({ I }) => {
  I.amOnPage('/');
  I.dontSeeElement({ css: 'pierce/.burger-button' });

  I.usePuppeteerTo('change viewport width', async ({ page }) => {
    await page.setViewport({
      width: 600,
      height: 800,
    });
  });

  I.seeElement({ css: 'pierce/.burger-button' });
  I.click({ css: 'pierce/.burger-button' });

  Object.entries(NAV_LINKS).forEach(([label, link]) => {
    I.see(label, { css: `pierce/a[href="${link}"]` });
  });
});

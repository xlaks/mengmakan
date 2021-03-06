/* eslint-disable no-undef */
Feature('Submitting Restaurant Review');

Before(({ I }) => {
  I.amOnPage('/');
  I.seeElement('restaurant-card');

  I.click('pierce/.description-wrapper a');
});

const newReview = {
  name: 'Agus',
  review: 'Makanannya lezat.',
  date: '29 Oktober 2020',
};

const mockResponse = {
  error: false,
  message: 'success',
  customerReviews: [
    {
      name: 'Budi',
      review: 'Makanannya tidak lezat.',
      date: '13 November 2019',
    },
    newReview,
  ],
};

Scenario('submitting new review', async ({ I }) => {
  I.seeElement('review-form');
  I.mockRequest('POST', 'https://restaurant-api.dicoding.dev/review', mockResponse);
  I.fillField({ css: 'pierce/input#name' }, newReview.name);
  I.fillField({ css: 'pierce/textarea#review' }, newReview.review);
  I.click({ css: 'pierce/form button' });

  I.seeNumberOfElements({ name: 'review-item' }, 2); // review items
  mockResponse.customerReviews.forEach(({ name, review }) => {
    I.see(name, { css: 'div[name="review-item"] b' });
    I.see(review, { css: 'div[name="review-item"] p' });
  });
});

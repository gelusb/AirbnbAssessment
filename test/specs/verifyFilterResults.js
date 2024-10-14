const homePage = require('../pages/homePage');
const searchResultsPage = require('../pages/searchResultsPage');
const propertyDetailsPage = require('../pages/propertyDetailsPage');
const { getFormattedDate } = require('../utils/dateUtils');

describe('Airbnb applying and validating filters', () => {
    it('should navigate to Airbnb', async () => {
        await browser.url('https://www.airbnb.com/');
        await browser.pause(2000); 
    });

    it('should search for properties with filters and verify results', async () => {
        const location = 'Rome, Italy';
        const adults = 2;
        const children = 1;

        await homePage.selectLocation(location);
        await homePage.selectDates(7, 14);
        await homePage.selectGuests(adults, children);
        await browser.pause(3000);
        await homePage.search();
        await browser.pause(1000);
        await homePage.openMoreFilters();
        await browser.pause(1000);
        await homePage.setBedrooms(5);
        await browser.pause(1000);
        await homePage.clickShowMore();
        await homePage.selectPoolAmenity();
        await browser.pause(1000);
        await homePage.clickShowPlaces();
        await browser.pause(1000);
        await searchResultsPage.verifyResultsHaveMinimumBedrooms(5);
        await browser.pause(2000)
        await searchResultsPage.clickFirstPropertyWithRetry();
        await browser.pause(3000);
        await propertyDetailsPage.verifyPoolFacility();
        await browser.pause(3000);
    });
});

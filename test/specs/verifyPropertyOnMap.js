const HomePage = require('../pages/homePage');
const SearchResultsPage = require('../pages/searchResultsPage');
const { expect } = require('chai');

describe('Airbnb verify property on the map', () => {
    it('should verify that a property is displayed correctly on the map', async () => {

        await browser.url('https://www.airbnb.com');
        console.log('Navigated to Airbnb');
        await HomePage.selectLocation('Rome, Italy');
        console.log('Location selected: Rome, Italy');
        const checkInDate = new Date();
        checkInDate.setDate(checkInDate.getDate() + 7);
        const checkOutDate = new Date(checkInDate);
        checkOutDate.setDate(checkOutDate.getDate() + 7); 
        await HomePage.selectDates(checkInDate, checkOutDate);
        console.log(`Check-In date: ${checkInDate.toDateString()}, Check-Out date: ${checkOutDate.toDateString()}`);
        await HomePage.selectGuests(2, 1);
        console.log('Number of guests selected: 2 adults, 1 child');
        await HomePage.clickSearch();
        console.log('Search initiated');
        await SearchResultsPage.waitForResults();
        console.log('Search results loaded');
        const firstProperty = await SearchResultsPage.getFirstProperty();
        await firstProperty.moveTo();
        console.log('Hovered over the first property in the search results');
        const isHighlighted = await SearchResultsPage.isPropertyHighlightedOnMap(firstProperty);
        expect(isHighlighted).to.be.true;
        console.log('Property is highlighted on the map upon hover');
        await SearchResultsPage.clickMapPin(firstProperty);
        console.log('Clicked on the map pin for the property');
        const propertyDetails = await firstProperty.getPropertyDetails();
        const mapPopupDetails = await SearchResultsPage.getMapPopupDetails();
        expect(propertyDetails.title).to.equal(mapPopupDetails.title, 'Property titles do not match');
        expect(propertyDetails.price).to.equal(mapPopupDetails.price, 'Property prices do not match');
        console.log('Property details in the map popup match the search results');
    });
});

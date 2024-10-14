const HomePage = require('../pages/homePage');
const SearchResultsPage = require('../pages/searchResultsPage');
const { expect } = require('chai');

describe('Airbnb verify simple search results', () => {
    it('should search with specific criteria and verify the results match', async () => {
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

        const properties = await SearchResultsPage.properties;

        for (const property of properties) {
            const guestCapacity = await property.getGuestCapacity();
            console.log(`Property capacity: ${guestCapacity} guests`);
            expect(guestCapacity).to.be.at.least(3, 'The property does not accommodate at least 3 guests');
        }
        console.log('All properties accommodate at least 3 guests');

        const filtersApplied = await SearchResultsPage.getAppliedFilters();
        
        expect(filtersApplied.location).to.equal('Rome, Italy');
        expect(filtersApplied.dates.checkIn).to.equal(checkInDate.toDateString());
        expect(filtersApplied.dates.checkOut).to.equal(checkOutDate.toDateString());
        expect(filtersApplied.guests.adults).to.equal(2);
        expect(filtersApplied.guests.children).to.equal(1);

        console.log('Filters verified: Location, Dates, and Guests match the search criteria');
    });
});

const { getFormattedDate } = require ('../utils/dateUtils');
class HomePage {
    get locationInput() { return $('#bigsearch-query-location-input'); }
    get checkInInput() { return $('div[data-testid="structured-search-input-field-split-dates-0"]'); }
    get checkOutInput() { return $('div[data-testid="structured-search-input-field-split-dates-1"]'); }
    get guestsInput() { return $('div[data-testid="structured-search-input-field-guests-button"]'); }
    get searchButton() { return $('[data-testid="structured-search-input-search-button"]'); }
    get moreFiltersButton() { return $('[data-testid="category-bar-filter-button"]'); }
    get bedroomsFilter() { return $('button[aria-label="increase value"]'); }
    get poolFilter() { return $('label[for="amenities-checkbox-4"]'); }
    get applyFiltersButton() { return $('button[data-testid="filter-panel-save-button"]'); }

    async selectLocation(location) {
        await this.locationInput.waitForDisplayed();
        await this.locationInput.click();
        await this.locationInput.setValue(location);
        const firstSuggestion = await $('#bigsearch-query-location-suggestion-0');
        await firstSuggestion.waitForDisplayed({ timeout: 10000 });
        await firstSuggestion.click();
    }

    async selectDates(checkInDaysFromNow, checkOutDaysFromNow) {
        await this.checkInInput.waitForDisplayed();
        await this.checkInInput.click();
        await browser.pause(1000); // Wait for the calendar to open
        const checkInDate = getFormattedDate(checkInDaysFromNow);
        const checkOutDate = getFormattedDate(checkOutDaysFromNow);
        console.log("Calculated Check-in Date: ", checkInDate);
        console.log("Calculated Check-out Date: ", checkOutDate);
        await this.selectDate(checkInDate);
        await this.selectDate(checkOutDate);
    }

    async selectDate(date) {
        await browser.pause(1000); 
        const dateElement = await $(`[data-testid="${date}"]`);
        await dateElement.waitForDisplayed({ timeout: 15000 });
        if (await dateElement.isDisplayed()) {
            await dateElement.click();
        } else {
            throw new Error(`Date element "${date}" is not displayed.`);
        }
    }

    async selectGuests(adults, children) {
        await this.guestsInput.waitForDisplayed(); 
        await this.guestsInput.click();
        const addAdultButton = await $('[data-testid="stepper-adults-increase-button"]');
        const addChildButton = await $('[data-testid="stepper-children-increase-button"]');
        await addAdultButton.waitForDisplayed();
        await addChildButton.waitForDisplayed();
        for (let i = 0; i < adults; i++) {
            await addAdultButton.click(); 
        }

        for (let i = 0; i < children; i++) {
            await addChildButton.click(); 
        }
    }
    
   async search() {
        this.searchButton.click();
        browser.pause(3000); 
    }

    async openMoreFilters() {
        this.moreFiltersButton.click();
    }

    async setBedrooms(minBedrooms) {
        // Click the button the required number of times
        for (let i = 0; i < minBedrooms; i++) {
            try {
                await this.bedroomsFilter.scrollIntoView({ block: 'center' }); 
                await this.bedroomsFilter.waitForClickable({ timeout: 15000 }); 
                await this.bedroomsFilter.click(); 
                await browser.pause(500); 
            } catch (error) {
                console.error(`Error clicking on bedrooms button: ${error.message}`);
                throw new Error("Unable to click the bedrooms increase button.");
            }
        }
    }

    async clickShowMore() {
        const showMoreButtonSelector = '//button[contains(span, "Show more")]';
        for (let i = 0; i < 3; i++) {
            // Scroll down by the height of the window
            await browser.execute(() => {
                window.scrollBy(0, window.innerHeight);
            });
            await browser.pause(1000); 
            const showMoreButton = await $(showMoreButtonSelector);
            const isDisplayed = await showMoreButton.isDisplayed();
    
            if (isDisplayed) {
                await showMoreButton.click();
                return; 
            }
        }
        throw new Error('Show more button not found after scrolling.');
    }
    
    async clickShowPlaces() {
        // Use XPath to find the button with text that starts with "Show" and ends with "places"
        const showPlacesButton = await $('//a[contains(text(), "Show") and contains(text(), "places")]');
        await showPlacesButton.waitForDisplayed({ timeout: 10000 });
        await showPlacesButton.waitForClickable({ timeout: 10000 });
        await showPlacesButton.click();
    }

    async selectPoolAmenity() {
        const poolButtonSelector = await $('#filter-item-amenities-7');
        const poolButton = await $(poolButtonSelector);
        await poolButton.waitForExist({ timeout: 10000 });
        await browser.execute((button) => {
            button.scrollIntoView();
        }, poolButton);
        await poolButton.waitForDisplayed({ timeout: 10000 });
        await poolButton.click(); 
    }
    
    async verifyFirstPropertyHasPool() {
        const firstProperty = await $('div.property-class:first-child'); 
        const amenities = await firstProperty.$$('li.amenity-class'); 
        const hasPool = await Promise.all(amenities.map(async (amenity) => {
            const text = await amenity.getText();
            return text.includes('Pool');
        }));
        expect(hasPool.includes(true)).to.be.true; 
    }

    async applyFilters() {
        this.applyFiltersButton.click();
    }
}

module.exports = new HomePage();

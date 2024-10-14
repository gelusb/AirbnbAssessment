class SearchResultsPage {
    get properties() { return $$('[data-testid="card-container"]'); }
    get filtersSummary() { return $('div[data-testid="filter-summary"]'); }
    get mapPopup() { return $('[data-testid="map-popup"]'); }

    async waitForResults() {
        await browser.waitUntil(() => this.properties.length > 0, {
            timeout: 10000,
            timeoutMsg: 'Search results did not load within 10 seconds',
        });
    }
    async getAppliedFilters() {
        const location = await this.filtersSummary.$('.location').getText();
        const checkIn = await this.filtersSummary.$('.check-in').getText();
        const checkOut = await this.filtersSummary.$('.check-out').getText();
        const guestsText = await this.filtersSummary.$('.guests').getText();
        const guests = guestsText.match(/\d+/g).map(Number);

        return {
            location,
            dates: {
                checkIn,
                checkOut,
            },
            guests: {
                adults: guests[0],
                children: guests[1],
            },
        };
    }

    async properties() {
        return await $$('[data-testid="card-container"]');
    }

    async getGuestCapacity(property) {
        const capacityText = await property.$('[data-testid="guest-count"]').getText();
        const capacity = parseInt(capacityText.match(/\d+/)[0], 10);
        return capacity;
    }


    async verifyResultsHaveMinimumBedrooms(minBedrooms) {
        const numberOfProperties = this.properties.length; // Length is synchronous
        console.log(`Number of properties found: ${numberOfProperties}`);
        this.properties.forEach(async (property) => {
            const bedroomsText = await property.$('[data-testid="listing-card-subtitle"]').getText(); 
            const bedrooms = parseInt(bedroomsText.split(' ')[0], 10); 
            console.log(`Found property with ${bedrooms} bedrooms`);
            expect(bedrooms).to.be.at.least(minBedrooms);
        });
    }
    
    async clickFirstPropertyWithRetry(retries = 3) {
        const firstProperty = await this.properties[0];
        
        for (let i = 0; i < retries; i++) {
            try {
                await firstProperty.scrollIntoView(); 
                await firstProperty.waitForDisplayed(); 
                await firstProperty.click();
                console.log('Clicked on the first property successfully!');
                return; 
            } catch (error) {
                console.log(`Attempt ${i + 1}: Failed to click on the first property - ${error.message}`);
                await browser.pause(1000); 
            }
        }
        throw new Error('Failed to click on the first property after multiple attempts.');
    }

    async isPropertyHighlightedOnMap(property) {
        // Retrieve a reference to the corresponding map pin based on the property details or index
        const mapPin = await this.getMapPinForProperty(property);
        const pinColor = await mapPin.getCSSProperty('color'); 
        return pinColor.value === 'rgb(255, 0, 0)'; 
    }

    async getMapPinForProperty(property) {
        return $('[data-testid="map-pin"]'); 
    }

    async clickMapPin(property) {
        const mapPin = await this.getMapPinForProperty(property);
        await mapPin.click();
    }

    async getMapPopupDetails() {
        await this.mapPopup.waitForDisplayed({ timeout: 5000 });
        const title = await this.mapPopup.$('.title').getText(); 
        const price = await this.mapPopup.$('.price').getText(); 

        return {
            title,
            price,
        };
    }

    
}

module.exports = new SearchResultsPage();

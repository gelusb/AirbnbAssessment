class PropertyDetailsPage {
    get firstButton() {
        return $('button[type="button"]');
    }

    get showAllAmenitiesButton() {
        return $('//button[contains(text(),"Show all 53 amenities")]');
    }

    get poolAmenity() {
        return $('//div[contains(text(),"Pool")]');
    }

    async closePopup() {
        console.log('Attempting to close the popup...');
        const buttonExists = await this.firstButton.waitForExist({
            timeout: 5000, 
            timeoutMsg: 'Button was not found after waiting',
        });

        if (buttonExists) {
            console.log('Button found. Clicking to close the popup...');
            await this.firstButton.click();
            console.log('Popup should be closed now.');
        } else {
            console.log('Button was not found. No action taken.');
        }
    }
    async openAmenitiesSection() {
        console.log('Attempting to click on "Show all amenities" button...');
        await this.showAllAmenitiesButton.waitForExist({
            timeout: 5000,
            timeoutMsg: '"Show all amenities" button was not found after waiting',
        });
        await this.showAllAmenitiesButton.click();
        console.log('"Show all amenities" button clicked.');
    }

    async verifyPoolFacility() {
        // Ensure any popups are closed first
        await this.closePopup();
        await this.openAmenitiesSection();
        console.log('Checking for pool amenity in the amenities list...');
        const poolExists = await this.poolAmenity.waitForExist({
            timeout: 5000,
            timeoutMsg: 'Pool amenity was not found after waiting',
        });

        if (poolExists) {
            console.log('The property has a pool amenity.');
        } else {
            console.log('Validation Failure: The property does NOT have a pool amenity.');
        }
        expect(poolExists).to.be.true;
    }

}

module.exports = new PropertyDetailsPage();

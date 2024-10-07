document.addEventListener("DOMContentLoaded", function() {
    checkRestaurantStatus();
});

function checkRestaurantStatus() {
    const currentTime = new Date();

    // Convert current time to Moscow time
    const moscowOffset = 3 * 60; // Moscow is UTC+3
    const localOffset = currentTime.getTimezoneOffset();
    const moscowTime = new Date(currentTime.getTime() + (moscowOffset + localOffset) * 60000);

    const currentHours = moscowTime.getHours();
    const openHour = 10;  // Opening time in Moscow
    const closeHour = 22; // Closing time in Moscow

    // Get references to the closed message and menu section
    const closedMessage = document.getElementById('closed-message');
    const menuSection = document.getElementById('menu-section');

    // Check if the restaurant is open or closed
    if (currentHours >= openHour && currentHours < closeHour) {
        // Restaurant is open
        menuSection.classList.remove('hidden');
        closedMessage.classList.add('hidden');
        document.body.classList.remove('no-scroll'); // Allow scrolling
    } else {
        // Restaurant is closed
        menuSection.classList.add('hidden');
        closedMessage.classList.remove('hidden');
        document.body.classList.add('no-scroll'); // Disable scrolling
    }
}

function openTab(evt, tabName) {
    // Hide all tab content
    const tabContent = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].classList.remove('active');
    }

    // Remove the active class from all buttons
    const tabButtons = document.getElementsByClassName('tab-button');
    for (let i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }

    // Show the current tab and add the active class to the button that opened it
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// Set the default active tab (only if the restaurant is open)
document.addEventListener("DOMContentLoaded", function() {
    const currentTime = new Date();
    const moscowOffset = 3 * 60; // Moscow is UTC+3
    const localOffset = currentTime.getTimezoneOffset();
    const moscowTime = new Date(currentTime.getTime() + (moscowOffset + localOffset) * 60000);

    const currentHours = moscowTime.getHours();
    if (currentHours >= 10 && currentHours < 22) {
        document.getElementsByClassName('tab-button')[0].click();
    }
});

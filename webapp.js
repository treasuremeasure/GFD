document.addEventListener("DOMContentLoaded", function() {
    checkRestaurantStatus();
});

function checkRestaurantStatus() {
    const currentTime = new Date();

    // Calculate Moscow time
    const moscowOffset = 3 * 60; // Moscow is UTC+3
    const localOffset = currentTime.getTimezoneOffset(); // Get local offset in minutes
    const moscowTime = new Date(currentTime.getTime() + (moscowOffset + localOffset) * 60000);

    const currentHours = moscowTime.getHours();
    const openHour = 10;  // Opening time in Moscow
    const closeHour = 22; // Closing time in Moscow

    // Get references to the closed message and menu section
    const closedMessage = document.getElementById('closed-message');
    const menuSection = document.getElementById('menu-section');

    console.log(`Current Moscow time: ${moscowTime}`);
    console.log(`Current Moscow hours: ${currentHours}`);

    // Check if the restaurant is open or closed
    if (currentHours >= openHour && currentHours < closeHour) {
        // Restaurant is open
        console.log("Restaurant is open.");
        menuSection.classList.remove('hidden');
        closedMessage.classList.add('hidden');
        document.body.classList.remove('no-scroll'); // Allow scrolling
    } else {
        // Restaurant is closed
        console.log("Restaurant is closed.");
        menuSection.classList.add('hidden');
        closedMessage.classList.remove('hidden');
        document.body.classList.add('no-scroll'); // Disable scrolling
    }
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


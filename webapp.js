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

// Set the default active tab when the page loads
document.addEventListener("DOMContentLoaded", function() {
    document.getElementsByClassName('tab-button')[0].click();
});

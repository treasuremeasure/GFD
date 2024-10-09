document.addEventListener("DOMContentLoaded", function() {
    document.getElementsByClassName('tab-button')[0].click();

    // Get all add buttons and add event listeners to them
    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            updateOrder(button);
        });
    });
});

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

function showOrderSummary() {
    // Hide the menu section and show the order summary
    document.getElementById('menu-section').classList.add('hidden');
    document.getElementById('order-summary').classList.remove('hidden');
}

function updateOrder(button) {
    // Rest of the updateOrder function remains the same
}

function updateQuantity(quantityDiv, change, price) {
    // Rest of the updateQuantity function remains the same
}

function showOrderButton() {
    const orderButton = document.getElementById('order-button');
    if (orderButton.classList.contains('hidden')) {
        orderButton.classList.remove('hidden');
    }
}

function updateTotal(amount) {
    const orderButton = document.getElementById('order-button');
    let currentTotal = parseInt(orderButton.getAttribute('data-total')) || 0;
    currentTotal += amount;
    orderButton.setAttribute('data-total', currentTotal);
    orderButton.querySelector('.order-summary-button').textContent = `Мой заказ: ${currentTotal} ₽`;

    // Update the final order button in the order summary screen
    const orderSummaryButtonFinal = document.querySelector('.order-summary-button-final');
    orderSummaryButtonFinal.textContent = `Заказать: ${currentTotal} ₽`;
}

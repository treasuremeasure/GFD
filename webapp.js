document.addEventListener("DOMContentLoaded", function() {
    document.getElementsByClassName('tab-button')[0].click();

    // Get all add buttons and add event listeners to them
    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            updateOrder(button);
        });
    });

    // Add event listener to the "Мой заказ" button
    const orderButton = document.querySelector('.order-summary-button');
    if (orderButton) {
        orderButton.addEventListener('click', showOrderSummary);
    }
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

function updateOrder(button) {
    const productCard = button.closest('.product-card');
    let quantityDiv = productCard.querySelector('.quantity-section');

    // If quantity section doesn't exist, create it
    if (!quantityDiv) {
        quantityDiv = document.createElement('div');
        quantityDiv.classList.add('quantity-section');
        
        const minusButton = document.createElement('button');
        minusButton.textContent = "-";
        minusButton.classList.add('minus-button');
        minusButton.addEventListener('click', () => updateQuantity(quantityDiv, -1, 160));

        const quantityValue = document.createElement('span');
        quantityValue.textContent = "1";
        quantityValue.classList.add('quantity-value');

        const plusButton = document.createElement('button');
        plusButton.textContent = "+";
        plusButton.classList.add('plus-button');
        plusButton.addEventListener('click', () => updateQuantity(quantityDiv, 1, 160));

        quantityDiv.appendChild(minusButton);
        quantityDiv.appendChild(quantityValue);
        quantityDiv.appendChild(plusButton);

        // Replace the add button with the quantity section
        button.replaceWith(quantityDiv);

        showOrderButton();
        updateTotal(160); // Initial amount for one item added
    }
}

function updateQuantity(quantityDiv, change, price) {
    const quantityValue = quantityDiv.querySelector('.quantity-value');
    let currentQuantity = parseInt(quantityValue.textContent);
    currentQuantity += change;

    // Ensure the quantity is not less than 1
    if (currentQuantity < 1) return;

    quantityValue.textContent = currentQuantity;

    // Update the total price
    updateTotal(change * price);
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
}

function showOrderSummary() {
    console.log("Order summary button clicked");

    const orderSummary = document.getElementById('order-summary');
    const menuSection = document.getElementById('menu-section');
    const orderButton = document.getElementById('order-button');

    // Hide main menu and show order summary
    menuSection.classList.add('hidden');
    orderButton.classList.add('hidden');
    orderSummary.classList.remove('hidden');

    // Populate order summary details
    const orderItemsDiv = document.getElementById('order-items');
    orderItemsDiv.innerHTML = '';

    const quantitySections = document.querySelectorAll('.quantity-section');
    if (quantitySections.length === 0) {
        console.error("No items found in the order");
        orderItemsDiv.innerHTML = '<p>Вы еще не добавили товары в заказ.</p>';
        return;
    }

    // Iterate through selected products to add to summary
    quantitySections.forEach(section => {
        const productTitle = section.closest('.product-card').querySelector('.product-title').textContent;
        const quantityValue = section.querySelector('.quantity-value').textContent;

        const orderItem = document.createElement('p');
        orderItem.textContent = `${productTitle}, Кол-во: ${quantityValue}`;
        orderItemsDiv.appendChild(orderItem);
    });

    // Set final total in the summary button
    const finalTotal = orderButton.getAttribute('data-total');
    document.getElementById('final-total').textContent = finalTotal;
}


document.addEventListener("DOMContentLoaded", function () {
    document.getElementsByClassName('tab-button')[0].click();

    // Extract telegram_user_id from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const telegramUserId = urlParams.get('telegram_user_id');

    // Log the extracted value to check if it's being captured correctly
    if (!telegramUserId) {
        console.error("Telegram User ID not found in the URL. Value extracted:", telegramUserId);
        alert('Ошибка: Не удалось получить идентификатор пользователя Telegram.');
    } else {
        console.log("Telegram User ID extracted:", telegramUserId);
    }

    // Set the telegramUserId globally to be used in the sendOrderToAdmin function
    window.telegramUserId = telegramUserId;

    // Get all add buttons and add event listeners to them
    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', function () {
            updateOrder(button);
        });
    });

    // Add event listener to the "Мой заказ" button
    const orderButton = document.querySelector('.order-summary-button');
    if (orderButton) {
        orderButton.addEventListener('click', showOrderSummary);
    }

    // Adding event listener to the "Заказать" button for final order submission with debouncing
    const orderFinalButton = document.querySelector('.order-summary-button-final');
    if (orderFinalButton) {
        orderFinalButton.addEventListener('click', function () {
            if (!orderFinalButton.disabled) {
                sendOrderToAdmin();
                orderFinalButton.disabled = true; // Disable button to prevent double submission
                setTimeout(() => {
                    orderFinalButton.disabled = false; // Re-enable button after a short delay
                }, 3000); // Set delay to prevent rapid re-clicking (3 seconds)
            }
        });
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
    const orderSummary = document.getElementById('order-summary');
    const homeSection = document.getElementById('home');
    const menuSection = document.getElementById('navbar');
    const orderButton = document.getElementById('order-button');

    // Hide main menu and show order summary
    menuSection.classList.add('hidden');
    orderButton.classList.add('hidden');
    homeSection.classList.add('hidden');
    orderSummary.classList.remove('hidden');

    // Populate order summary details
    const orderItemsDiv = document.getElementById('order-items');
    orderItemsDiv.innerHTML = '';

    // Iterate through selected products to add to summary
    const quantitySections = document.querySelectorAll('.quantity-section');
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

function sendOrderToAdmin() {
    const orderItemsDiv = document.getElementById('order-items');
    let cart = '';
    const orderItems = orderItemsDiv.querySelectorAll('p');
    orderItems.forEach(item => {
        cart += item.textContent + '\n';
    });

    const phoneNumber = document.getElementById('phone-number').value;
    const paymentMethod = document.getElementById('cash').checked ? 'Наличными' : 'Переводом';
    const pickupType = document.getElementById('pickup').checked ? 'Самовывоз' : 'Доставка';
    const price = document.getElementById('final-total').textContent;
    const comment = document.getElementById('order-comment').value;


    // Use the telegramUserId from the URL parameter
    const telegramId = window.telegramUserId;

    // Log the telegramUserId to ensure it's being used properly
    console.log("Telegram ID being used for order:", telegramId);

    // Check if telegramId is missing
    if (!telegramId || telegramId === "YOUR_USER_CHAT_ID") {
        console.error("Error: Telegram ID is invalid or missing.", telegramId);
        alert('Ошибка: Не удалось получить идентификатор пользователя Telegram.');
        return;
    }

    const orderData = {
        cart: cart.trim(),
        phone_number: phoneNumber,
        payment_method: paymentMethod,
        pickup_type: pickupType,
        price: parseInt(price),
        telegram_id: telegramId, // Use the correct telegramId from URL params
        comment: comment.trim()
    };

    // Log the full orderData before sending
    console.log("Order Data to be sent to the backend:", orderData);

    fetch('http://127.0.0.1:5000/new_order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    }).then(response => {
        if (response.ok) {
            alert('Order sent successfully to the admin');
        } else {
            response.json().then(data => {
                console.error("Backend responded with an error:", data.error);
                alert(`Failed to send order to admin: ${data.error}`);
            });
        }
    }).catch(error => {
        console.error('An error occurred while sending the order:', error);
        alert('An error occurred while sending the order');
    });
}

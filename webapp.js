document.addEventListener("DOMContentLoaded", function() {
    document.getElementsByClassName('tab-button')[0].click();

    // Get all add buttons and add event listeners to them
    const addButtons = document.querySelectorAll('.add-button');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            updateOrder(button);
        });
    });

    // Add event listener for the "Мой заказ" button
    const orderButton = document.querySelector('.order-summary-button');
    orderButton.addEventListener('click', showOrderSummary);
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
    // Clear current content and show order summary
    const menuSection = document.getElementById('menu-section');
    menuSection.innerHTML = `
        <div id="order-summary">
            <div id="order-items">
                <h3>Ваш заказ:</h3>
                <!-- Add logic here to list items and quantities -->
            </div>
            <label>Введите номер телефона:</label>
            <input type="text" id="phone-number" placeholder="+7">
            <button id="confirm-phone">Подтвердить</button>

            <h4>Способ оплаты:</h4>
            <input type="checkbox" id="payment-cash" name="payment" value="cash">
            <label for="payment-cash">Наличными</label><br>
            <input type="checkbox" id="payment-transfer" name="payment" value="transfer">
            <label for="payment-transfer">Переводом</label><br>

            <h4>Способ получения заказа:</h4>
            <input type="checkbox" id="pickup" name="delivery" value="pickup">
            <label for="pickup">Самовывоз</label><br>
            <input type="checkbox" id="delivery" name="delivery" value="delivery">
            <label for="delivery">Доставка</label><br>

            <label>Комментарий к заказу:</label>
            <textarea placeholder="Укажите дополнительные пожелания или особенности вашего заказа здесь..."></textarea>

            <button class="order-summary-button-final">Заказать: ${document.getElementById('order-button').getAttribute('data-total')} ₽</button>
        </div>
    `;
}

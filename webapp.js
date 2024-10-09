function showOrderSummary() {
    console.log("Order summary button clicked");

    const orderSummary = document.getElementById('order-summary');
    const menuSection = document.getElementById('menu-section');
    const orderButton = document.getElementById('order-button');

    // Check if elements are properly selected
    if (!orderSummary || !menuSection || !orderButton) {
        console.error("Order summary, menu section, or order button elements are not found.");
        return;
    }

    // Hide main menu and show order summary
    menuSection.classList.add('hidden');
    orderButton.classList.add('hidden');
    orderSummary.classList.remove('hidden');

    // Populate order summary details
    const orderItemsDiv = document.getElementById('order-items');
    orderItemsDiv.innerHTML = '';

    const quantitySections = document.querySelectorAll('.quantity-section');
    console.log("Quantity Sections:", quantitySections);
    
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
    console.log("Final Total:", finalTotal);
    document.getElementById('final-total').textContent = finalTotal;

    // Fix to ensure that the button for placing the order shows the correct amount
    const orderSummaryButton = document.querySelector('.order-summary-button-final');
    if (orderSummaryButton) {
        orderSummaryButton.textContent = `Заказать: ${finalTotal} ₽`;
    }
}

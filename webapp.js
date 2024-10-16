document.addEventListener("DOMContentLoaded", function () {
    document.getElementsByClassName('tab-button')[0].click();

    // Extract telegram_user_id from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const telegramUserId = urlParams.get('telegram_user_id');

    if (!telegramUserId) {
        console.error("Telegram User ID not found in the URL. Value extracted:", telegramUserId);
        alert('Ошибка: Не удалось получить идентификатор пользователя Telegram.');
    } else {
        console.log("Telegram User ID extracted:", telegramUserId);
    }

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

    // Adding event listener to the "Заказать" button for final order submission
    const orderFinalButton = document.querySelector('.order-summary-button-final');
    if (orderFinalButton) {
        orderFinalButton.addEventListener('click', function () {
            if (!orderFinalButton.disabled) {
                orderFinalButton.disabled = true; // Disable button to prevent double submission
                sendOrderToAdmin().then(() => {
                    // Enable button after the order is sent and response is received
                    setTimeout(() => {
                        orderFinalButton.disabled = false; 
                    }, 3000); // Delay to prevent multiple quick submissions
                }).catch(() => {
                    // In case of an error, re-enable the button sooner for retry
                    orderFinalButton.disabled = false;
                });
            }
        });
    }
});

function sendOrderToAdmin() {
    return new Promise((resolve, reject) => {
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

        const telegramId = window.telegramUserId;

        if (!telegramId || telegramId === "YOUR_USER_CHAT_ID") {
            console.error("Error: Telegram ID is invalid or missing.", telegramId);
            alert('Ошибка: Не удалось получить идентификатор пользователя Telegram.');
            reject();
            return;
        }

        const orderData = {
            cart: cart.trim(),
            phone_number: phoneNumber,
            payment_method: paymentMethod,
            pickup_type: pickupType,
            price: parseInt(price),
            telegram_id: telegramId
        };

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
                resolve();
            } else {
                response.json().then(data => {
                    console.error("Backend responded with an error:", data.error);
                    alert(`Failed to send order to admin: ${data.error}`);
                    reject();
                });
            }
        }).catch(error => {
            console.error('An error occurred while sending the order:', error);
            alert('An error occurred while sending the order');
            reject();
        });
    });
}

from flask import Flask, request, jsonify
import telebot
from telebot import types

# Initialize Flask app
app = Flask(__name__)

# Replace with your own bot token from BotFather
bot = telebot.TeleBot('YOUR_ADMIN_BOT_TOKEN')

# Orders endpoint to receive order details from User Bot
@app.route('/new_order', methods=['POST'])
def new_order():
    try:
        order_data = request.json

        # Extract order data from the incoming request
        cart = order_data.get('cart', '')
        phone_number = order_data.get('phone_number', '')
        payment_method = order_data.get('payment_method', '')
        pickup_type = order_data.get('pickup_type', '')
        price = order_data.get('price', '')
        telegram_id = order_data.get('telegram_id', '')

        # Send formatted message to the admin chat
        order_message = (
            f"\U0001F4E2 Новый заказ:\n\n"
            f"Корзина:\n{cart}\n\n"
            f"Номер телефона: {phone_number}\n"
            f"Метод оплаты: {payment_method}\n"
            f"Тип получения: {pickup_type}\n"
            f"Цена: {price} ₽\n"
            f"Telegram id: \"{telegram_id}\""
        )
        bot.send_message(chat_id='YOUR_ADMIN_CHAT_ID', text=order_message)

        return jsonify({'message': 'Order received and sent to admin'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Start Flask app
if __name__ == "__main__":
    app.run(port=5000)

# Handle admin response to an order
@bot.message_handler(func=lambda message: True)
def handle_admin_response(message):
    try:
        # Assuming the admin sends a message in the format "<minutes>" or "<minutes> <delivery_cost>"
        response_parts = message.text.split()
        if len(response_parts) == 1:
            # Case 1: Only preparation time is provided
            prep_time = response_parts[0]
            response_message = f"Ваш заказ был принят. Будет готов через {prep_time} мин."
            bot.send_message(message.chat.id, response_message)
        elif len(response_parts) == 2:
            # Case 2: Preparation time and delivery cost are provided
            prep_time, delivery_cost = response_parts
            total_cost = int(orders[1]['price']) + int(delivery_cost)  # Example uses order 1
            response_message = (
                f"Ваш заказ был принят. Будет готов через {prep_time} мин.\n"
                f"Стоимость доставки: {delivery_cost} ₽\n"
                f"Стоимость заказа вместе с доставкой: {total_cost} ₽"
            )
            bot.send_message(message.chat.id, response_message)
        else:
            bot.send_message(message.chat.id, "Неверный формат ответа. Пожалуйста, используйте: '<минуты>' или '<минуты> <стоимость доставки>'")
    except Exception as e:
        bot.send_message(message.chat.id, f"Произошла ошибка: {str(e)}")

# Start the bot
bot.polling()
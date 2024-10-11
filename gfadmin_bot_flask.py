from flask import Flask, request, jsonify
import telebot
from telebot import types
from flask_cors import CORS  # Import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Replace with your own bot token from BotFather
bot = telebot.TeleBot('8106083107:AAHW6FzfGqRrYzFFYRpzeiW6S3_I0DV7GVQ')

@bot.message_handler(func=lambda message: True)
def send_chat_id(message):
    chat_id = message.chat.id
    bot.send_message(chat_id, f"Your Chat ID is: {chat_id}")
    print(f"Admin Chat ID: {chat_id}")

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

        # Replace with actual admin group or admin user chat ID
        admin_chat_id = '-1002473137359'

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
        bot.send_message(chat_id=admin_chat_id, text=order_message)

        return jsonify({'message': 'Order received and sent to admin'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Start Flask app without bot polling
if __name__ == "__main__":
    app.run(port=5000, debug=True)

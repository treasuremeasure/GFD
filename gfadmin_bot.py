import telebot
from telebot import types

# Replace with your own bot token from BotFather
bot = telebot.TeleBot('8106083107:AAHW6FzfGqRrYzFFYRpzeiW6S3_I0DV7GVQ')

# In-memory store for orders (could be replaced with a database in production)
orders = {}

# Handle receiving new orders from the customer bot (Simulated here)
# In practice, this could be done by receiving data from another bot or an API
@bot.message_handler(commands=['new_order'])
def handle_new_order(message):
    # Simulate receiving an order (in practice, this data would come from the customer bot)
    order_id = len(orders) + 1
    order_details = {
        'cart': "1. Говяжий Club Sandwich x1 (340 ₽)\n+Фри\n+Соус Кетчуп",
        'phone_number': "+7 (962) 743-02-71",
        'payment_method': "Наличными",
        'pickup_type': "Самовывоз",
        'price': 340,
        'telegram_id': message.chat.id
    }
    orders[order_id] = order_details

    # Send order details to admin group
    order_message = (
        f"\U0001F4E2 Новый заказ:\n\n"
        f"Корзина:\n{order_details['cart']}\n\n"
        f"Номер телефона: {order_details['phone_number']}\n"
        f"Метод оплаты: {order_details['payment_method']}\n"
        f"Тип получения: {order_details['pickup_type']}\n"
        f"Цена: {order_details['price']} ₽\n"
        f"Telegram id: \"{order_details['telegram_id']}\""
    )
    bot.send_message(message.chat.id, order_message)

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
import telebot

bot = telebot.TeleBot('8106083107:AAHW6FzfGqRrYzFFYRpzeiW6S3_I0DV7GVQ')

@bot.message_handler(func=lambda message: True)
def handle_admin_response(message):
    try:
        response_parts = message.text.split()
        if len(response_parts) == 1:
            prep_time = response_parts[0]
            response_message = f"Ваш заказ был принят. Будет готов через {prep_time} мин."
            bot.send_message(message.chat.id, response_message)
        elif len(response_parts) == 2:
            prep_time, delivery_cost = response_parts
            response_message = (
                f"Ваш заказ был принят. Будет готов через {prep_time} мин.\n"
                f"Стоимость доставки: {delivery_cost} ₽\n"
            )
            bot.send_message(message.chat.id, response_message)
        else:
            bot.send_message(message.chat.id, "Неверный формат ответа.")
    except Exception as e:
        bot.send_message(message.chat.id, f"Произошла ошибка: {str(e)}")

bot.polling()

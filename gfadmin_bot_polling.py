import telebot

bot = telebot.TeleBot('8106083107:AAHW6FzfGqRrYzFFYRpzeiW6S3_I0DV7GVQ')

@bot.message_handler(func=lambda message: True)
def handle_admin_response(message):
    try:
        # Проверяем, что сообщение администратора является ответом на заказ
        if message.reply_to_message and "Новый заказ:" in message.reply_to_message.text:
            # Извлекаем Telegram ID из исходного сообщения
            original_message = message.reply_to_message.text
            telegram_id_line = [line for line in original_message.split('\n') if "Telegram id" in line]
            if not telegram_id_line:
                bot.send_message(message.chat.id, "Ошибка: Не удалось найти Telegram ID в сообщении.")
                return
            
            # Извлекаем Telegram ID пользователя
            telegram_id = telegram_id_line[0].split(":")[1].strip().replace('"', '')

            # Обработка ответа администратора
            response_parts = message.text.split()
            if len(response_parts) == 1:
                prep_time = response_parts[0]
                response_message = f"Ваш заказ был принят. Будет готов через {prep_time} мин."
                bot.send_message(telegram_id, response_message)  # Отправка пользователю
                bot.send_message(message.chat.id, f"Пользователю было отправлено сообщение:\n{response_message}")
            elif len(response_parts) == 2:
                prep_time, delivery_cost = response_parts
                response_message = (
                    f"Ваш заказ был принят. Будет готов через {prep_time} мин.\n"
                    f"Стоимость доставки: {delivery_cost} ₽\n"
                )
                bot.send_message(telegram_id, response_message)  # Отправка пользователю
                bot.send_message(message.chat.id, f"Пользователю было отправлено сообщение:\n{response_message}")
            else:
                bot.send_message(message.chat.id, "Неверный формат ответа.")
        else:
            bot.send_message(message.chat.id, "Ошибка: Сообщение не является ответом на заказ.")
    except Exception as e:
        bot.send_message(message.chat.id, f"Произошла ошибка: {str(e)}")

bot.polling()

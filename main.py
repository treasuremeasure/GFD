import telebot
from telebot import types

# Replace with your own bot token from BotFather
bot = telebot.TeleBot('7697917113:AAEKOG8TZl5N2qa7TnxRCnhez55R2RizckE')

# Handle the /menu command
@bot.message_handler(commands=['menu'])
def send_menu(message):
    # Create a custom keyboard with a Web App button
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    
    # Web App configuration
    web_app_url = 'https://treasuremeasure.github.io/GFD/'  # Replace with your web app URL
    web_app_button = types.WebAppInfo(web_app_url)
    
    # Adding the WebApp button to the keyboard
    menu_button = types.KeyboardButton(text="Меню 🍔", web_app=web_app_button)
    markup.add(menu_button)
    
    # Send the custom keyboard to the user
    bot.send_message(message.chat.id, "Кнопка меню", reply_markup=markup)

# Start the bot
bot.polling()

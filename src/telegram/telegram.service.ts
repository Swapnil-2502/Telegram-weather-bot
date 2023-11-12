import { Injectable } from '@nestjs/common';

import TelegramBot = require('node-telegram-bot-api');
import axios from 'axios';

const TELEGRAM_TOKEN = '6775409073:AAFSZgNsi021TcpYxXGVFc51luu2Vsc0xrQ';

@Injectable()
export class TelegramService {
  constructor() {
    const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

    // Listen for any kind of message. There are different kinds of
    // messages.
    bot.on('message', async (msg) => {
      const chatId = msg.chat.id;
      const userInput = msg.text;

      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=metric&appid=44ba54e7c0a4c177459c90f145c9a984`,
        );
        const data = response.data;
        const weather = data.weather[0].description;
        const temperature = data.main.temp;
        const city = data.name;
        const humidity = data.main.humidity;
        const pressure = data.main.pressure;
        const windSpeed = data.wind.speed;
        const message = `The weather in ${city} is ${weather} with a temperature of ${temperature}°C. The humidity is ${humidity}%, the pressure is ${pressure}hPa, and the wind speed is ${windSpeed}m/s.`;

        bot.sendMessage(chatId, message);
      } catch (error) {
        bot.sendMessage(chatId, "City doesn't exist.");
      }

      // send a message to the chat acknowledging receipt of their message
      // bot.sendMessage(chatId, userInput);
    });
  }
}

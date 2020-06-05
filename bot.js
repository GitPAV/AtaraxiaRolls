// Discord needed imports :
let Discord = require('discord.io');
let logger = require('winston');
let auth = require('./auth.json');

// Custom imports : 
let rollModule = require('./botFile/roll')
let randomStringModule = require('./botFile/randomString')

const axios = require('axios');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

// Initialize Discord Bot
let bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    console.log(user)
    console.log(userID)
    console.log(channelID)
    console.log(message)
    console.log(evt)

    // Checking the command symbol
    if (message.substring(0, 1) == '!') {
        let userParams = message.substring(1).split(' ');
        let messages = ''

        // User command
        let command = userParams[0]
        // RollParams, cuted after first space
        let rollParams = userParams[1]

        console.log('commande :',command)
        console.log('rollParams :',rollParams)
        console.log('userParams base',userParams)

        // ***********************************
        // ************ HELP *****************
        // ***********************************

        // ***********************************
        // ******* RANDOMIZE STRINGS *********
        // ***********************************
        if (command.startsWith('randomize')) {
            messages = randomStringModule.handleRandomizeCommands(userParams, user)
        }

        // ***********************************
        // ************ ROLLS ****************
        // ***********************************
        else if (command.startsWith('roll')) {
            messages = rollModule.handleDiceCommands(rollParams, user)
        }
        
        // ****** END OF USER COMMANDS *******
        // If there is a message display it, if not, display default message
        if (messages.length > 0) {
            bot.sendMessage({
                to: channelID,
                message: messages,
            });
        }
        // Display error messages, if there is no messages to send
        else {
            let defaultMessageEmojiPool = ['🦮','🐕‍🦺','🐶','🐕',]
            let randomDogEmoji = Math.floor(Math.random() * defaultMessageEmojiPool.length);
            console.log('random number ???',randomDogEmoji)

            messages = `>>> Sorry **${user}**, I did not understand your request   ${defaultMessageEmojiPool[randomDogEmoji]}`

            bot.sendMessage({
                to: channelID,
                message: messages,
            });
        }

    }
});
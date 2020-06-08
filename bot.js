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
        // Full user command, splited on whitespace
        let userParams = message.substring(1).split(' ');
        // Display message variable, filled by function call
        let messages = ''

        // User command
        let command = userParams[0]
        // RollParams, cuted after first space
        let rollParams = userParams[1]
        // Option for roll command
        let rollOptionParam = userParams[2]

        // If there is more than 3 parameters, add option to rollOptionParam variable
        if(userParams.length > 3) {
            for (let i = 3; i < userParams.length; i++) {
                rollOptionParam += ' ' + userParams[i]
            }
        }

        console.log('commande :', command)
        console.log('userParams base', userParams)
        console.log('rollParams :', rollParams)
        console.log('rollParamsOption :', rollOptionParam)

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
            messages = rollModule.handleDiceCommands(rollParams, user, rollOptionParam)
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

            messages = `>>> Sorry **${user}**, I did not understand your request   ${defaultMessageEmojiPool[randomDogEmoji]}`

            bot.sendMessage({
                to: channelID,
                message: messages,
            });
        }

    }
});
// Discord needed imports :
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

// Custom imports : 
let rollModule = require('./botFile/roll')

const axios = require('axios');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
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
        var args = message.substring(1).split(' ');

        let command = args[0]
        let params = args[1]

        console.log('commande :',command)
        console.log('params :',params)

        // ***********************************
        // ************ HELP *****************
        // ***********************************

        // ***********************************
        // ******** RANDOMIZE WORDS **********
        // ***********************************
        if (command.startsWith('randomize')) {
        }

        // ***********************************
        // ************ ROLLS ****************
        // ***********************************
        if (command.startsWith('roll')) {
            let messages = rollModule.handleDiceCommands(params, user)

            if (messages.length > 0) {

                bot.sendMessage({
                    to: channelID,
                    message: messages,
                });

            }
        }

    }
});
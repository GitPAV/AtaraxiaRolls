// import { baseUrl } from './route.js';

var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');

const axios = require('axios');

// const baseUrl = "https://discordapp.com/api"
// console.log("baseUrl:",baseUrl)
// let toto 

// toto = xhttp.open("GET", baseUrl + "/channels/", true);
// console.log("get here:",toto)

// axios.get('https://discordapp.com/api/guilds/354613483821596672')
//   .then(response => {
//     console.log("response :",response);
//     console.log(response.data);
//   })
//   .catch(error => {
//     console.log(error);
//   });


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
        console.log('arg[1',params)

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
            handleDiceCommands(params, user, channelID)
        }

    }
});

// ************************************************************************
// ** MAIN ROLL FUNCTION, Manage rolls dependings on user command params **
// ************************************************************************
const handleDiceCommands = (params, user, channelID) => {
    // Saving user command in order to display it later
    let userRollCommand = params
    let bonus = 0
    let result

    // ** Spilting arguments in command, to get numberOfDice and NumberOfFace **
    params = params.split('d')

    let numberOfDice = params[0]
    let numberOfFace = params[1]

    // ** Checking if there is bonus number to add to the roll **
    if (numberOfFace.includes('+')) {
        faceAndBonus = numberOfFace.split('+')
        bonus = parseInt(faceAndBonus[1], 10)
        numberOfFace = faceAndBonus[0]
    }

    // ** Actual roll **
    result = rollDice(numberOfDice, numberOfFace)

    displayRollResult(userRollCommand, result, bonus, user, channelID)
}

// Roll dice function
const rollDice = (nbrOfDices, nbrOfFaces) => {
    let tempResult = []

    for (let i = 0; nbrOfDices > i; i++) {
        tempResult[i] = Math.floor(Math.random() * nbrOfFaces);
        tempResult[i] = tempResult[i] + 1
    }

    return tempResult
}

// Display roll results, based on number of results(one roll or > one)
const displayRollResult = (userRollCommand, result, bonus, user, channelID) => {
    let messages = ''

    // 1) IF RESULT IS ONLY 1 ROLL
    if (result.length == 1) {

        // If there is a bonus, change display and sums
        if(bonus > 0) {
            let resultPlusBonus = parseInt(result, 10)  + bonus
            messages =
            `>>> **${user}** rolled **${userRollCommand}** and got : **${result}** + *${bonus}*  = ***${resultPlusBonus}***`
        }

        else {
            messages =
            `>>> **${user}** rolled **${userRollCommand}** and got : ***${result}***`
        }
        
    }

    // 2) IF RESULST IS AN ADDITION OF ROLLS
    else if (result.length > 1) {
        let humanResults = ''
        let sums = 0

        // Make the sums of rolled dices
        for (let i = 0; i < result.length; i++) {
            sums += result[i]
        }

        // Make a more human friendly display of every rolls
        for (let i = 0; i < result.length; i++) {
            if (i == (result.length - 1)) {
                humanResults += result[i]
                break
            }
            humanResults += result[i] + ' + '
        }

        // If there is a bonus, change display and sums
        if(bonus > 0) {
            let resultPlusBonus = parseInt(sums, 10)  + bonus
            messages = `>>> **${user}** rolled **${userRollCommand}**, and got : ${humanResults} = ***${sums}*** \n\n __Final result__ : **${sums}** + *${bonus}*  = ***${resultPlusBonus}***` 
        }

        else{
            messages = `>>> **${user}** rolled **${userRollCommand}**, and got :\n\n ${humanResults} = ***${sums}***`
        }
    }

    // Display message if everything went right
    if(messages.length > 0) {
        bot.sendMessage({
            to: channelID,
            message: messages,
        });
    }
}
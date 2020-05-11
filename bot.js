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

    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');

        let command = args[0]
        let params = args[1]

        // console.log(command)
        // console.log(params)

        if(command.startsWith('roll')) {
            let bonus = 0
            let result

            params = params.split('d')

            let numberOfDice = params[0]
            let numberOfFace = params[1]
            params = args[1]

            if(numberOfFace.includes('+')) {
                faceAndBonus = numberOfFace.split('+')
                bonus = parseInt(faceAndBonus[1], 10)
                numberOfFace = faceAndBonus[0]
            }

            result = rollDice(numberOfDice, numberOfFace)
            // if(bonus > 0) {
            //     result
            // }
            if(result.length == 1) {
                console.log(typeof result)
                console.log(typeof bonus)
                result[0] = result[0] + bonus
                let messages = 
                    ` **${user}** rolled **${params}** and got : **${result}**`
 
                bot.sendMessage({
                    to: channelID,
                    message: messages,
                });

            }


            // If result is an addition of roll
            else if(result.length > 1) {
                let sums = 0

                for (let i = 0; i < result.length; i++) {
                    sums += result[i]
                }

                sums = sums + bonus
                let bonusIncluded = `= ${sums}`
                let messages = `${user} rolled ${params}, and got :\n ${result} ${bonusIncluded}`

                bot.sendMessage({
                    to: channelID,
                    message: messages,
                });

            }
        }

     }
});

const rollDice = (nbrOfDices, nbrOfFaces) => {
    let tempResult = []

    for(let i = 0; nbrOfDices > i; i++) {
        tempResult[i] = Math.floor(Math.random() * nbrOfFaces);
        tempResult[i] = tempResult[i] + 1
    }

    return tempResult
}
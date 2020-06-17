const { info } = require("winston");

module.exports = {
    // ************************************************************************
    // ** MAIN ROLL FUNCTION, Manage rolls dependings on user command params **
    // ************************************************************************
    handleDiceCommands: (params, user, rollOptionParam) => {
        console.log('paramOpt in starting modules: ', rollOptionParam)
        // Saving user command in order to display it later
        let userRollCommand = params
        // Possible bonus to add to final count (positive of negative)
        let bonus = 0
        // Boolean, Special display if dice has 20 faces
        let twentyfaceDice = false
        // Sums of rolled dice
        let result
        // Displayed message (final value returned)
        let message = ''
        // Operators for bonus value of roll
        const operators = ['+', '-']

        // ** Spilting arguments in command, to get numberOfDice and NumberOfFace **
        params = params.split('d')

        let numberOfDice = params[0]
        let numberOfFace = params[1]

        // ** Checking if there is bonus number to add to the roll **
        for (let i = 0; i < operators.length; i++) {
            if (numberOfFace.includes(operators[i])) {
                faceAndBonus = numberOfFace.split(operators[i])
                bonus = parseInt(faceAndBonus[1], 10)

                // If the operators is - the integer take negative value
                if(operators[i] == '-') {
                    bonus = -Math.abs(bonus)
                }

                // Restoring number of faces as an usuable value (an integer)
                numberOfFace = faceAndBonus[0]
            }        
        }

        // Check if the dice has 20 faces, if it does make boolean to true, to display specials messages
        if(numberOfDice == 1 && numberOfFace == 20) {
            twentyfaceDice = true 
        }

        // ** Actual roll **
        result = rollDice(numberOfDice, numberOfFace)
        // ** Base message based on result and number of dice rolled **
        message = displayRollResult(userRollCommand, result, bonus, user, twentyfaceDice)

        // Additional options and parameter handled here
        if(rollOptionParam != undefined) {

            // Split params
            console.log('rollOpt before split:', rollOptionParam)
            rollOptionParam = rollOptionParam.split(' ')
            console.log('rollOpt after split:', rollOptionParam)

            for (let i = 0; i < rollOptionParam.length; i++) {
                // Create differents commands and shortcuts for requested options
                const averageCommands = ['-average','-a']
                const sucessCommands = ['-success','-s']
                const rerollCommands = ['-reroll','-r']

                // 1) -average, -a (Calculate the average of rolled dices and display it to user)
                for (let j = 0; j < averageCommands.length; j++) {
                    if(rollOptionParam[i].includes(averageCommands[j])) {
                        message = makeAverage(result, message)
                        break
                    }  
                }

                // 2) -success(x), -s(x) (Define a threshold of sucess for gived rolled dice)    
                for (let j = 0; j < sucessCommands.length; j++) {
                    if(rollOptionParam[i].includes(sucessCommands[j])) {
                        let successParam = []

                        // Edit sucessCommands to get the function param
                        successParam = rollOptionParam[i]
                        successParam = successParam.split(sucessCommands[j])
                        successParam = successParam[1]

                        message = defineSuccess(result, message, successParam, numberOfFace)
                        break
                    }
                }
                
                // 3) reroll(/x), -r(/x) (Define dice to reroll based on one or many value)
                for (let j = 0; j < rerollCommands.length; j++) {
                    if(rollOptionParam[i].includes(rerollCommands[j])) {
                        let rerollParam = []

                        rerollParam = rollOptionParam[i]
                        rerollParam = rerollParam.split(rerollCommands[j])
                        rerollParam = rerollParam[1]
                        // Split with '/' to get reroll value(s)
                        rerollParam = rerollParam.split('/')

                        // Handling bad syntax parameters by displaying an error messages
                        if(rerollParam.length == 1) {
                            message += `\n\n ⚠️ *You must provide '/value' in order to use the reroll command*`
                            break
                        }

                        message = rerollDice(result, message, rerollParam, user, numberOfFace)
                        break                        
                    } 
                }

            }
        }

        // End of additionals options
        return message
    },
};

// - Dice Roll main function :
// ************************************************************************
// ************************ Roll dice function ****************************
// ************************************************************************
const rollDice = (nbrOfDices, nbrOfFaces) => {
    let tempResult = []

    for (let i = 0; nbrOfDices > i; i++) {
        tempResult[i] = Math.floor(Math.random() * nbrOfFaces);
        tempResult[i] = tempResult[i] + 1
    }

    return tempResult
}

// ************************************************************************
// * Display roll results, based on number of results (one roll or > one) *
// ************************************************************************    
const displayRollResult = (userRollCommand, result, bonus, user, twentyfaceDice) => {
    let messages = ''

    // 1) IF RESULT IS ONLY 1 ROLL
    if (result.length == 1) {

        // ** Checking if there is bonus number to add to the roll **
        if (bonus > 0) {
            let resultPlusBonus = parseInt(result, 10) + bonus
            messages =
                `>>> **${user}** rolled **${userRollCommand}** and got : **${result}** \n\n __Final result__ : **${result}** + *${bonus}*  = ***${resultPlusBonus}***`
        }
        // If the bonus is negative, change display and sums
        else if(bonus < 0) {
            bonus = Math.abs(bonus)
            let resultPlusBonus = parseInt(result, 10) - bonus
            messages =
                `>>> **${user}** rolled **${userRollCommand}** and got : **${result}** \n\n __Final result__ : **${result}** - *${bonus}*  = ***${resultPlusBonus}***`
        }

        // Else basic message
        else {
            messages =
                `>>> **${user}** rolled **${userRollCommand}** and got : ***${result}***`
        }

        // Handle critical failure/success for d20
        if(twentyfaceDice == true && result == 1) {
            messages += `\n\n ***CRITICAL FAILURE !!***`
        }
        else if(twentyfaceDice == true && result == 20) {
            messages += `\n\n ***NATURAL TWENTY !!***`
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

        // ** Checking if there is bonus number to add to the roll **
        if (bonus > 0) {
            let resultPlusBonus = parseInt(sums, 10) + bonus
            messages = `>>> **${user}** rolled **${userRollCommand}**, and got : ${humanResults} = ***${sums}*** \n\n __Final result__ : **${sums}** + *${bonus}*  = ***${resultPlusBonus}***`
        }
        // If the bonus is negativ, cahnge display and sums
        else if(bonus < 0) {
            bonus = Math.abs(bonus)
            let resultPlusBonus = parseInt(sums, 10) - bonus
            messages = `>>> **${user}** rolled **${userRollCommand}**, and got : ${humanResults} = ***${sums}*** \n\n __Final result__ : **${sums}** - *${bonus}*  = ***${resultPlusBonus}***`
        }

        // Else basic display
        else {
            messages = `>>> **${user}** rolled **${userRollCommand}**, and got :\n\n ${humanResults} = ***${sums}***`
        }
    }

    // 3) RETURN CORECT MESSAGE
    return messages
}

// - Dice Roll options :
// ************************************************************************
// ************** Make the average of result and display it ***************
// ************************************************************************
const makeAverage = (result, message) => {
    let average = 0

    // Add all diceroll to have to sums
    for (let i = 0; i < result.length; i++) {
        average += result[i]
    }

    // Divide by number of dice rolled to get the average
    average = average / result.length

    // Edit the message to display average
    message += `\n\n The *average* of rolls is : **${average}**`
    return message
}

// ************************************************************************
// ********** Define success param for dice roll and display it ***********
// ************************************************************************
const defineSuccess = (result, message, successThreshold, numberOfFace) => {
    // New array to push successfull roll in
    let successfullRoll = []

    // 1) Handle bad user setting
    if(successThreshold < 0 || successThreshold > numberOfFace) {
        message += `\n\n ⚠️ *Invalid success setting, you must pick a number between 1 and max roll* ⚠️`
        return message
    }

    // Find result that match success threshold
    for (let i = 0; i < result.length; i++) {
        if(result[i] >= successThreshold) {
            successfullRoll.push(result[i])
        }
    }

    // 2) If there is successfull roll 
    if(successfullRoll.length > 0) {
        let displayedsuccessfullRoll = ''
        for (let i = 0; i < successfullRoll.length; i++) {
            if(i == (successfullRoll.length -1)) {
                displayedsuccessfullRoll += successfullRoll[i]
            }
            else {
                displayedsuccessfullRoll += successfullRoll[i] + ', '
            }
        }
        return message += `\n\n Based on **${successThreshold}**, You got **${successfullRoll.length}** successfull roll : \n\n - ${displayedsuccessfullRoll}`
    }

    // 3) If there is no successfull roll 
    if(successfullRoll.length == 0) {
        return message += `\n\n Based on **${successThreshold}**, you got no successfull roll`
    }
}

// ************************************************************************
// **** Define reroll paramters and roll again if the value is matched ****
// ************************************************************************
const rerollDice = (result, message, rerollParam, user, numberOfFace) => {
    let trimedRerollParam = []
    // console.log('User in REROLLDICE :', user)
    // console.log('rerollParam :', rerollParam)
    // console.log('original message :', message)
    // console.log('original result :', result)
    // console.log('numberOfface :', numberOfFace)

    // Trim empty index of original array or unmatching params
    for (let i = 0; i < rerollParam.length; i++) {
        if(rerollParam[i].match(/^[0-9]*$/gm) && rerollParam[i].length > 0) {
            trimedRerollParam.push(rerollParam[i])
        }
    }

    message = trimDiceToReroll(trimedRerollParam, result, message, numberOfFace)
    return message
}

const trimDiceToReroll = (trimedRerollParam, result, message, numberOfFace) => {
    console.log('original result :', result)
    console.log('trimedReroll param :', trimedRerollParam)
    let diceToReroll = []
    let resultWithReroll = []

    diceToReroll = trimDice(trimedRerollParam, result)
    console.log('DICE TO REROLL AFTER FN :',diceToReroll)
    resultWithReroll = sortResult(diceToReroll, result)
    console.log('RESULSTWITOUTREROLLED :',resultWithReroll)

    // If a dice need to be rerolled enter the loop
    if(diceToReroll.length > 1) {
        while(diceToReroll.length > 1) {
            // Variable for a more firendly human display
            let displayedDiceToReroll = ''
            let displayedResult = ''
            // New roll made in this function
            let newRoll = []

            // Create user friendly display of numbers
            displayedDiceToReroll = numberForMessageDisplay(diceToReroll)
            displayedResult = numberForMessageDisplay(result)

            // Display the need for reroll, and wich dices need to be rerolled
            message+= `\n\nBased on ${displayedResult}, there is **${diceToReroll.length}** dice to reroll ! \nDice that need to be rerolled: ${displayedDiceToReroll} `
        
            // Reroll dice that needs to be and create user friendly display
            newRoll = rollDice(result.length, numberOfFace)
            displayedDiceToReroll = numberForMessageDisplay(newRoll)

            message += `\nAfter reroll you got : ${displayedDiceToReroll}`

            diceToReroll = trimDice(trimedRerollParam, newRoll)
        }
    }

    // If there is dice to reroll display it before doing it
    else {
        message += `\n\n*No reroll needed*`
    }

    return message
}

// Based on result and reroll param, get the list of dice that need to be rerolled
const trimDice = (rerollParam, tempResult) => {
    let diceToReroll = []

    // Compare result with wanted reroll value to see if there is any match, push matching one in new array
    for (let i = 0; i < tempResult.length; i++) {
        for (let j = 0; j < rerollParam.length; j++) {
            if(rerollParam[j] == tempResult[i]) {
                diceToReroll.push(tempResult[i])
            }
        }
    }
    return diceToReroll
}

// Based on result and dice that need reroll, return a list of result without dices that need to be rerolled
const sortResult = (diceToReroll, result) => {
    console.log('result in sort FN :',result)
    let resultWithoutReroll = result

    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < diceToReroll.length; j++) {
            if(result[i] == diceToReroll[j]) {
                resultWithoutReroll.splice(i, 1)
                diceToReroll.splice(j, 1)
            }
        }
    }

    console.log('result list without reroll value', resultWithoutReroll)
    console.log('dice to reroll in FN :', diceToReroll)

    return resultWithoutReroll
}

const numberForMessageDisplay = (numberArray) => {
    let displayedDice = ''

    for (let i = 0; i < numberArray.length; i++) {
        if(i == (numberArray.length - 1)) {
            displayedDice += numberArray[i]
        }
        else {
            displayedDice += numberArray[i] + ', '
        }
    }
    return displayedDice
}
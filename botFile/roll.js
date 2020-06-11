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
                        console.log('rolloption :', rerollParam)
                        rerollParam = rerollParam.split(rerollCommands[j])
                        console.log('split with if param :', rerollParam)
                        rerollParam = rerollParam[1]
                        // Split with '/' to get reroll value(s)
                        rerollParam = rerollParam.split('/')
                        console.log('split with if / :', rerollParam)

                        // Handling bad syntax parameters by displaying an error messages
                        if(rerollParam.length == 1) {
                            message += `\n\n ⚠️ *You must provide '/value' in order to use the reroll command*`
                            break
                        }

                        message = rerollDice(result, message, rerollParam, user, numberOfFace)                        
                    } 
                }

            }
        }
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
    console.log('1111:', user)
    console.log(rerollParam)
    console.log(message)
    console.log(result)

    // Reroll params after removing empty items
    let trimedParams = []
    // Possible rerolled dice
    let resultWithReroll = []

    // Trim empty index of original array
    for (let i = 0; i < rerollParam.length; i++) {
        if(rerollParam[i].length != 0) {
            trimedParams.push(rerollParam[i])
        }
    }

    // for (let i = 0; i < result.length; i++) {
    //     let diceToReroll = []
    //     for (let j = 0; j < trimedParams.length; j++) {
    //         if(result[i] == trimedParams[j]) {
    //             diceToReroll.push(result[i])
    //         }
    //         else {
    //             resultWithReroll.push(result[i]) 
    //         }
    //     }
    // }
    trimRerollDice(rerollParam, result)

    return message
}

const trimRerollDice = (rerollParam, result) => {
    let diceToReroll = []
}
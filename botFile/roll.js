module.exports = {
    // ************************************************************************
    // ** MAIN ROLL FUNCTION, Manage rolls dependings on user command params **
    // ************************************************************************
    handleDiceCommands: (params, user) => {
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

        return displayRollResult(userRollCommand, result, bonus, user)
    },
};

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
const displayRollResult = (userRollCommand, result, bonus, user) => {
    let messages = ''

    // 1) IF RESULT IS ONLY 1 ROLL
    if (result.length == 1) {

        // If there is a bonus, change display and sums
        if (bonus > 0) {
            let resultPlusBonus = parseInt(result, 10) + bonus
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
        if (bonus > 0) {
            let resultPlusBonus = parseInt(sums, 10) + bonus
            messages = `>>> **${user}** rolled **${userRollCommand}**, and got : ${humanResults} = ***${sums}*** \n\n __Final result__ : **${sums}** + *${bonus}*  = ***${resultPlusBonus}***`
        }

        else {
            messages = `>>> **${user}** rolled **${userRollCommand}**, and got :\n\n ${humanResults} = ***${sums}***`
        }
    }

    // Return message
    return messages
}
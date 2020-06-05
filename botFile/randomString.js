module.exports = {
    // ************************************************************************
    // ********************* Randomize string handler *************************
    // ************************************************************************
    handleRandomizeCommands: (params, user) => {
        // Future array with removed command in params
        let sortedParams = []

        // Removing command from params, and remove whitespaces
        for (let i = 1; i < params.length; i++) {
            if(params[i].length > 0) {
                sortedParams.push(params[i])
            }
        }

        // Picking random number based on params array.length
        let randomIndex = Math.floor(Math.random() * sortedParams.length);

        // return sortedParams[randomIndex]
        return displayRandomizeResult(sortedParams[randomIndex], user)
    }
}

const displayRandomizeResult = (result, user) => {
    let messages = `>>> **${user}** picked : ***${result}***`
    
    return messages
}
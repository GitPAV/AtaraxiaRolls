module.exports = {
    // ************************************************************************
    // ********************* Randomize string handler *************************
    // ************************************************************************
    handleRandomizeCommands: (params, user) => {
        console.log('param in module',params)

        // Espace en trop a éliminer ici
        for (let i = 0; i < params.length; i++) {
            console.log(params[i].length)
        }

        // Future array with removed command in params
        let sortedParams = []

        // Removing command from params
        for (let i = 1; i < params.length; i++) {
            sortedParams.push(params[i])
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
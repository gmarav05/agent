export async function getWeather() {

    const weather = {
        forecast: 'Sunny'
    }

    return JSON.stringify(weather)
}

export async function getLocation() {

    const location = {
        location: 'Hyderabad, India'
    }
    
    return JSON.stringify(location)
}


export const tools = [
    {
        type: "function",
        function: {
            name: "getCurrentWeather",
            description: "Get the current weather",
            parameters: {
                type: "object",
                properties: {}
            }
        }
    },
    {
        type: "function",
        function: {
            name: "getLocation",
            description: "Get the user's current location",
            parameters: {
                type: "object",
                properties: {}
            }
        }
    },
]
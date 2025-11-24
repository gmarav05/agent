import 'dotenv/config'
import OpenAI from "openai"
import { getWeather, getLocation } from "./tools.js"

export const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
})

const availableFunctions = {
   getWeather,
   getLocation
}

const systemPrompt = `
You cycle through Thought, Action, PAUSE, Observation. At the end of the loop you output a final Answer. Your final answer should be highly specific to the observations you have from running
the actions.
1. Thought: Describe your thoughts about the question you have been asked.
2. Action: run one of the actions available to you - then return PAUSE.
3. PAUSE
4. Observation: will be the result of running those actions.

Available actions:
- getWeather: 
    E.g. getWeather: Salt Lake City
    Returns the current weather of the location specified.
- getLocation:
    E.g. getLocation: null
    Returns user's location details. No arguments needed.

Example session:
Question: Please give me some ideas for activities to do this afternoon.
Thought: I should look up the user's location so I can give location-specific activity ideas.
Action: getLocation: null
PAUSE

You will be called again with something like this:
Observation: "New York City, NY"

Then you loop again:
Thought: To get even more specific activity ideas, I should get the current weather at the user's location.
Action: getWeather: New York City
PAUSE

You'll then be called again with something like this:
Observation: { location: "New York City, NY", forecast: ["sunny"] }

You then output:
Answer: <Suggested activities based on sunny weather that are highly specific to New York City and surrounding areas.>
`


async function agent(query) {
    const messages = [
        {
            role:"system",
            content: systemPrompt
        },

        {
            role:"user",
            content: query
        }

    ]

    const MAX_ITERATIONS = 5
    const actionRegex = /^Action: (\w+): (.*)$/

    for (let i = 0; i < MAX_ITERATIONS; i++) {
        
        
            const response = await openai.chat.completions.create({
                model:"gemini-2.5-flash",
                messages
               
            })
            const responseText = response.choices[0].message.content
            messages.push( { role:'assistant' , content: responseText } )
        
            const responseLines = responseText.split("\n")
            console.log(responseLines)
        
            const foundActionStr = responseLines.find(str => actionRegex.test(str))
        
            if (foundActionStr) {
        
                const actions = actionRegex["exec"](foundActionStr)
                const [_, action, actionArgument] = actions
        
        
                if (!availableFunctions.hasOwnProperty(action)) {
                    throw new Error(`Unknown action: ${action}: ${actionArgument}`)
                }
        
                const observation = await availableFunctions[action](actionArgument)
                messages.push({ role:"assistant" , content: `observation: ${observation}` })
        
            } else {
                return responseText
            }
    }
}

console.log(await  agent("What are some activity ideas that I can do this afternoon based on my location and weather?"))
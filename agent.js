import OpenAI from "openai"
import 'dotenv/config'
import { getWeather, getLocation, tools } from "./tools.js"

export const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
})

const availableFunctions = {
    getWeather,
    getLocation
}

async function agent(query) {
    const messages = [
        { role: "system", content: "You are a helpful AI agent. Give highly specific answers based on the information you're provided. Prefer to gather information with the tools provided to you rather than giving basic, generic answers." },
        { role: "user", content: query }
    ]

    const MAX_ITERATIONS = 5

    // for (let i = 0; i < MAX_ITERATIONS; i++) {
    //     console.log(`Iteration #${i + 1}`)
    const response = await openai.chat.completions.create({
        model:"gemini-2.5-flash",
        messages,
        tools
    })

    // const responseText = response.choices[0].message.content
    console.log(response.choices[0])
}


await agent("How are you today?")


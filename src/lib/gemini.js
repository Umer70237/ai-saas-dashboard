
console.log("gemini loaded")

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
})

export async function askAI(prompt) {
  const result = await model.generateContent(prompt)

  return result.response.text()
}
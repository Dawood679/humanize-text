
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});



async function generateOutput(input: string) {
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `${process.env.PROMPT}\n\n${input}`,
      });
    
      console.log(response.text);
      return response.text;
}

export default generateOutput;
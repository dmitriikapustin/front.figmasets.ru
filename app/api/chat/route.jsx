import { OpenAIStream, StreamingTextResponse } from 'ai'

export const runtime = 'edge';


export async function POST (req) {
  try {
    const { messages, system, temperature, max_tokens } = await req.json()
    console.log( system, temperature, max_tokens)
    const response = await fetch('https://api.goapi.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': 'Bearer 6c91b8b3628773040eb12cea4c69f3bdf9d787cf9b2d8b561a7a90c8d4ec28c3'
      },
      body: JSON.stringify({
        "model": "gpt-4-1106-preview",
        "messages": [
          {
            "role": "system",
            "content": system || ''
          },
          ...messages
        ],
        "temperature": temperature || 0.7,
        "max_tokens": max_tokens || 256,
        "stream": true
      })
    })


    return new StreamingTextResponse(OpenAIStream(response))
  
  } catch (error) {
    return Response.json({ error: 'Ошибка сервера' });
  }
}

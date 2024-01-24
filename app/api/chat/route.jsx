import { OpenAIStream, StreamingTextResponse } from 'ai'

export const runtime = 'edge';


export async function POST (req) {
  try {
    const { messages, system, temperature, max_tokens, isContext } = await req.json()
    
    // const contextMessages = isContext ? messages : [messages.slice(-1)[0]]
    
    const response = await fetch('https://api.goapi.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY}`
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

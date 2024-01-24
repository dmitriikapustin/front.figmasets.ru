"use client"
import Image from 'next/image'
import React, { useState, useRef, useEffect } from 'react'
import MarkdownPreview from '@uiw/react-markdown-preview'

import Checkbox from './Checkbox'
import Dropdown from './Dropdown';

export default function Home() {

  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [system, setSystem] = useState('Ты - полезный помощник');
  const [messages, setMessages] = useState([]);
  const [temp, setTemp] = useState('0.5');
  const [tokens, setTokens] = useState('128');
  const [preset, setPreset] = useState('Стандартный');
  const [parent, setParent] = useState('0');
  const [context, setContext] = useState(false);

  const handleSystem = (event) => {setSystem(event.target.value)}

  const endOfMessagesRef = useRef(null)

  const scrollToBottom = () => {endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })}

  useEffect(() => {scrollToBottom()}, [messages])


  async function fetchData () {

    const currentMessageIndex = context ? messages.length + 1 : 1
    setLoading(true)
    context ? setMessages([...messages, {role: "user", content: value}, {role: "assistant", content: ''}]) : setMessages([{role: "user", content: value}, {role: "assistant", content: ''}])
    setValue('')

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
            "content": system
          },
          ...messages
        ],
        "temperature": Number(temp),
        "max_tokens": Number(tokens),
        "stream": true
      })
    }) 

    let chunks = ''
    const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) {setLoading(false); return}

      chunks += value
      const lines = chunks.split('\n\n')
      try {
        lines.forEach((line) => {
          const dataObj = JSON.parse(line.replace('data: ', ''))
          const data = dataObj.choices[0].delta.content || ''

          setMessages((prevState) => {
            const prevArr = [...prevState] || []
            prevArr[currentMessageIndex].content = prevArr[currentMessageIndex]?.content + data
            return prevArr
          })
        })
      } 
      catch {}
  
      chunks = lines.slice(-1)[0]
    }
  }


  const handleEnterPress = (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      event.preventDefault()
      !loading && fetchData()
    }
  };

  const handleContext = (value) => {setContext(value)}
  const handleTemp = (value) => {setTemp(value)}
  const handleTokens = (value) => {setTokens(value)}
  const handlePreset = (value) => {setPreset(value)}


  return (
    <main className="flex flex-row p-5 gap-5 h-screen">
        <div className="sidebar rounded-lg flex flex-col justify-start items-start">
          <div className='flex flex-row gap-4 items-center w-max m-8'>
            <Image src="/logo.svg" width={80} height={100} alt='logo'/>
            <h2>kGPT</h2>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col p-4 mt-4 boxed w-full rounded-lg gap-8 pointer-events-none opacity-40">
              <div className='flex flex-col gap-2'>
                <p>Пресеты (coming soon)</p>
                <Dropdown 
                  def={0} 
                  options={['Стандартный','Переводчик','Программист', 'Категоризация', 'Маркетолог', 'Сметчик']} 
                  onSelect={handlePreset} 
                />
              </div>
            </div>
            <div className="flex flex-col p-4 mt-4 boxed w-full rounded-lg gap-8">
              <div className='flex flex-col gap-2'>
                <p className='opacity-60'>Системный prompt</p>
                <input 
                  className="w-full h-11 p-5 rounded" 
                  type="text" 
                  value={system} 
                  onChange={handleSystem} 
                />
              </div>
              <div className='flex flex-col gap-2'>
                <p className='opacity-60'>Настройка контекста</p>
                <Checkbox label='Сохранять контекст' onCheck={handleContext}/>
              </div>
              <div className='flex flex-col gap-2'>
                {/* <p>Выбор температуры</p> */}
                <Dropdown def={6} label='Температура:' options={['0.1','0.2','0.3','0.4','0.5','0.6','0.7','0.8','0.9','1']} onSelect={handleTemp} />
                <Dropdown def={3} label='Максимум токенов: ' options={['64','128','256','512','1024','2048',]} onSelect={handleTokens} />
              </div>
            </div>
          </div>
          <div className="flex flex-col h-full justify-end">
            <div className='opacity-40 text-xs'>© {new Date().getFullYear()}, created by <a href="https://kapustin.team" target='_blank'>k.team</a> <br/> Powered by OpenAI API <br/> GPT4-Turbo / gpt-4-1106-preview</div>
          </div>
        </div>
        <div className="main flex flex-col w-full justify-end items-center gap-4">
          <div className="messages flex flex-col rounded-lg w-full justify-end h-full gap-2 overflow-hidden">
            <div className="messagesScroll flex flex-col overflow-y-scroll px-2 mx-2 my-2 gap-4 items-end">
              {messages?.map((message, i) => {
                return (
                  <div className={"message w-full flex flex-row my-2 py-2 " + message.role} key={i}>
                    <MarkdownPreview className='p-2 px-4 rounded-md' source={message.content} />
                    {/* Usage */}
                  </div>
                )
              })}
              {/* {loading && 
                <div className='message w-full flex flex-row my-2 py-2 assistant'>
                  <div className="typing-indicator rounded-md p-3"> 
                    <span></span> <span></span> <span></span>
                  </div> 
                </div>
              }   */}
              <div ref={endOfMessagesRef} className='h-0'/>
            </div>
          </div>
          <div className='box rounded-lg flex flex-row gap-4 items-center w-full p-4'>  
            <input 
              className="w-full h-11 p-5 rounded" 
              type="text" 
              value={value} 
              onChange={(event) => setValue(event.target.value)} 
              onKeyDown={handleEnterPress}
            />
            <button className="rounded p-2 h-11" disabled={ loading && true} onClick={fetchData}> 
              <Image className="" src="/send.svg" width={28} height={28} alt='send_icon'/>
            </button>
          </div>      
        </div>
    </main>
  )
}

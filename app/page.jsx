"use client"
import Image from 'next/image'
import React, { useState, useRef, useEffect } from 'react'
import MarkdownPreview from '@uiw/react-markdown-preview'

import Checkbox from './Checkbox'
import Dropdown from './Dropdown';
import { useChat } from 'ai/react';


export default function Home() {

  const [system, setSystem] = useState('Ты - полезный помощник');
  const [temp, setTemp] = useState(0.5);
  const [tokens, setTokens] = useState(512);
  const [preset, setPreset] = useState('Стандартный');
  const [parent, setParent] = useState('0');
  const [context, setContext] = useState(false);


  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat(
    {
      body: {
        temperature: Number(temp),
        max_tokens: Number(tokens),
        system: system,
        // isContext: context
      }
    }
  )


  const handleSystem = (event) => {setSystem(event.target.value)}

  const endOfMessagesRef = useRef(null)

  const scrollToBottom = () => {endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })}

  useEffect(() => {scrollToBottom()}, [messages])

  const handleEnterPress = (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      event.preventDefault()
      // if (!context) setMessages([])
      handleSubmit(event)
    }
  };

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
              <div className='flex flex-col gap-2 pointer-events-none opacity-40'>
                <p className='opacity-60'>Настройка контекста</p>
                <Checkbox label='Сохранять контекст' isCheck={context} setIsCheck={setContext}/>
              </div>
              <div className='flex flex-col gap-2'>
                <Dropdown def={4} label='Температура:' options={[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]} onSelect={handleTemp} />
                <Dropdown def={3} label='Максимум токенов: ' options={[64, 128, 256, 512, 1024, 2048]} onSelect={handleTokens} />
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
              {messages?.map((message, i) => (
                <div className={"message w-full flex flex-row my-2 py-2 " + message.role} key={i}>
                  <MarkdownPreview className='p-2 px-4 rounded-md' source={message.content} />
                </div>
              ))}
              <div ref={endOfMessagesRef} className='h-0'/>
            </div>
          </div>
          <form className='box rounded-lg flex flex-row gap-4 items-center w-full p-4' onSubmit={handleSubmit} onKeyDown={handleEnterPress}>  
            <input 
              className="w-full h-11 p-5 rounded" 
              type="text" 
              value={input} 
              onChange={handleInputChange} 
            />
            <button className="rounded p-2 h-11" type='submit'> 
              <Image src="/send.svg" width={28} height={28} alt='send_icon'/>
            </button>
          </form>      
        </div>
    </main>
  )
}

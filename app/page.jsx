"use client"
import Image from 'next/image'
import React, { useState, useRef, useEffect } from 'react'
import MarkdownPreview from '@uiw/react-markdown-preview'
import axios from 'axios'

import Checkbox from './Checkbox'
import Dropdown from './Dropdown';

export default function Home() {

  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [system, setSystem] = useState('Ты - полезный помощник');
  const [messages, setMessages] = useState([]);
  const [temp, setTemp] = useState('0.7');
  const [tokens, setTokens] = useState('512');
  const [parent, setParent] = useState('0');
  const [context, setContext] = useState(false);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSystem = (event) => {
    setSystem(event.target.value);
  };

  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const options = {
    method: 'GET',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' }
  };
  function fetchData() {
    const user = value
    let cont = null
    setMessages([...messages, {role: "user", message: user}])
    setLoading(true)
    setValue('')
    // context && messages[messages.length-1].id && setParent(messages[messages.length-1].id) 

    console.log(messages)
    axios.get(`https://gpt.figmasets.ru/?prompt="${cont ? cont : user}"&system="${system}"&temp="${temp}"&tokens="${tokens}"&parent="${parent}"`, options)
      .then(function (response) {    // Обработка успешного ответа
        // setSource(response.data.resp.text)
        setLoading(false)
        console.log(response)
        setMessages([...messages, {role: "user", message: user}, {role: "assistant", message: response.data.resp.text, id: response.data.resp.id}])
      })
      .catch(function (error) {
        // Обработка ошибки при запросе
        console.error(error);
        setLoading(false)
        setMessages([...messages, {role: "error", message: user}, {role: "assistant", message: error}])
      })
      .then(function () {
        // Выполняется всегда после успешного или неуспешного завершения запроса
      });
  }
  const handleEnterPress = (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      event.preventDefault();
      !loading && fetchData()
    }
  };

  const handleContext = (value) => {
    console.log(value)
    setContext(value)
  };

  const handleTemp = (value) => {
    setTemp(value)
  };
  const handleTokens = (value) => {
    setTokens(value)
  };

  return (
    <main className="flex flex-row p-5 gap-5 h-screen">
        <div className="sidebar rounded-lg flex flex-col justify-between items-start">
          <div className='flex flex-row gap-4 items-center w-max'>
            <Image src="/logo.svg" width={80} height={100} alt='logo'/>
            <h2>kGPT</h2>
          </div>
          <div className="flex flex-col p-4 mt-4 boxed w-full rounded-lg gap-8">
            <div className='flex flex-col gap-2'>
              <p className='opacity-50'>Системный prompt</p>
              <input 
                className="w-full h-11 p-5 rounded" 
                type="text" 
                value={system} 
                onChange={handleSystem} 
              />
            </div>
            {/* <div className='flex flex-col gap-2'>
              <p className='opacity-50'>Настройка контекста</p>
              <Checkbox label='Сохранять контекст' onCheck={handleContext}/>
            </div> */}
            <div className='flex flex-col gap-2'>
              {/* <p>Выбор температуры</p> */}
              <Dropdown def={6} label='Температура:' options={['0.1','0.2','0.3','0.4','0.5','0.6','0.7','0.8','0.9','1']} onSelect={handleTemp} />
              <Dropdown def={3} label='Максимум токенов: ' options={['64','128','256','512','1024','2048',]} onSelect={handleTokens} />
            </div>
          </div>
        </div>
        <div className="main flex flex-col w-full justify-end items-center gap-4">
          <div className="messages flex flex-col rounded-lg w-full justify-end h-full gap-2 overflow-hidden">
            <div className="messagesScroll flex flex-col overflow-y-scroll px-2 mx-2 my-2 gap-4 items-end">
              { messages.map((message, i) => {
                return (
                  <div className={"message w-full flex flex-row my-2 py-2 " + message.role} key={i}>
                    <MarkdownPreview className='p-2 px-4 rounded-md' source={message.message} />
                    {/* Usage */}
                  </div>
                )
              })}
              { loading && 
                <div className='message w-full flex flex-row my-2 py-2 assistant'>
                  <div className="typing-indicator rounded-md p-3"> 
                    <span></span> <span></span> <span></span>
                  </div> 
                </div>
              }  
              <div ref={endOfMessagesRef} className='h-0'/>
            </div>
          </div>
          <div className='box rounded-lg flex flex-row gap-4 items-center w-full p-4'>  
            <input 
              className="w-full h-11 p-5 rounded" 
              type="text" 
              value={value} 
              onChange={handleChange} 
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

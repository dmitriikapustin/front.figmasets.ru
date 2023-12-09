"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import MarkdownPreview from '@uiw/react-markdown-preview'
import axios from 'axios'

export default function Home() {

  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const send = (event) => {
    setValue(event.target.value);
  };


  const options = {
    method: 'GET',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' }
  };
  function fetchData() {
    setLoading(true)
    axios.get(`https://gpt.figmasets.ru/?prompt="${value}"`, options)
      .then(function (response) {    // Обработка успешного ответа
        setSource(response.data.resp.text)
        setLoading(false)
        console.log(response)
      })
      .catch(function (error) {
        // Обработка ошибки при запросе
        console.error(error);
      })
      .then(function () {
        // Выполняется всегда после успешного или неуспешного завершения запроса
      });
  }
  const handleEnterPress = (event) => {
    // Код клавиши Enter равен 13 для 'onKeyPress' и 'Enter' для 'onKeyDown'
    if (event.key === 'Enter' || event.keyCode === 13) {
      event.preventDefault(); // Предотвращаем перевод строки в textarea
      // Ваше действие, например, отправка сообщения
      // console.log('Enter pressed, your action here', text);
      // ... дополнительные действия
      fetchData()
    }
  };


  // async function getData() {
  //   await fetch(`http://gpt.figmasets.ru/?prompt="${value}"`, options)
  //     .then(response => {
  //       if (response.status === 200) {
  //         setSource(response.text)
  //       } else {
  //         console.log(response.status)
  //       }
  //     })
  //     .catch(err => console.error(err));
  // }  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className='flex flex-row gap-4 items-center'>
          <Image src="/logo.svg" width={80} height={100}/>
          <h2>kGPT</h2>
        </div>
        <MarkdownPreview source={source} />
        {loading && <p>Загрузка...</p>}  
        <div className='flex flex-row gap-4 items-center w-1/2'>  
          <textarea 
            className="w-full h-20 p-5 rounded" 
            type="text" 
            value={value} 
            onChange={handleChange} 
            onKeyDown={handleEnterPress}
          />
          <button className="rounded p-2" disable={ loading && true} onClick={fetchData}> 
            <Image src="/send.svg" width={28} height={28}/>
          </button>
        </div>      
    </main>
  )
}

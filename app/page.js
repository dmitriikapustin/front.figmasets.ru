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
    axios.get(`http://gpt.figmasets.ru/?prompt="${value}"`, options)
      .then(function (response) {    // Обработка успешного ответа
        setSource(response.data.resp.text)
        setLoading(false)
        // console.log(response)
      })
      .catch(function (error) {
        // Обработка ошибки при запросе
        console.error(error);
      })
      .then(function () {
        // Выполняется всегда после успешного или неуспешного завершения запроса
      });
  }


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
        <MarkdownPreview source={source} />
        {loading && <p>Загрузка...</p>}        
        <textarea className="w-1/2 h-20" type="text" value={value} onChange={handleChange} />
        <button disable={ loading ?? true}onClick={fetchData}> 
          Отправить
        </button>
    </main>
  )
}

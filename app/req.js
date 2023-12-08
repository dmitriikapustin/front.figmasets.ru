export default function Req(value) {

    const options = {
        method: 'GET',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' }
      };

  async function getData() {
    await fetch(`http://gpt.figmasets.ru/?prompt="${value}"`, options)
      .then(response => {
        if (response.status === 200) {
          setSource(response.text)
        } else {
          console.log(response.status)
        }
      })
      .catch(err => console.error(err));
  }  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {/* <MarkdownPreview source={source} /> */}
        <p>{source}</p>
        <textarea type="text" value={value} onChange={handleChange} />
        <button onClick={getData}> 
          Отправить
        </button>
    </main>
  )
}
import './globals.sass'

export const metadata = {
  title: 'kGPT',
  description: 'GPT powered client by @dmitriikapustin',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}

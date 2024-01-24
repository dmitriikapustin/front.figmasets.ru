import './globals.sass'

export const metadata = {
  title: 'kGPT',
  description: 'GPT powered client by @dmitriikapustin',
}

export const runtime = 'edge';


export default function RootLayout({ children }) {
  return (
    <html lang="ru" data-color-mode="dark">
      <body>{children}</body>
    </html>
  )
}

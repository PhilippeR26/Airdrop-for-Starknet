import './globals.css'

export const metadata = {
  title: 'SJS6 token airdrop',
  description: 'Demo of airdrop in Starknet',
  icons: {
    icon: "./favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}

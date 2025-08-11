import './styles/globals.css'
import Navbar from '@/components/Navbar'

export const metadata = { title: process.env.NEXT_PUBLIC_APP_URL || 'MyApp' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}

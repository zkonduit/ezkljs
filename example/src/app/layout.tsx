import Header from '@/components/Header'
import './globals.css'
import type { Metadata } from 'next'
import APINavColumn from '@/components/APINavColumn'
import Main from '@/components/Main'

export const metadata: Metadata = {
  title: 'Hub Example',
  description: 'Shows usage of the @ezkljs/hub package in a Next.js app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className='m-0 h-screen flex flex-col'>
        {/* <!-- Top Navbar --> */}
        <Header />

        {/* <!-- Content Area --> */}
        <div className='flex-grow flex flex-row mt-16'>
          {/* <!-- Left Navigation Column --> */}
          <APINavColumn />

          {/* <!-- Main Content Area --> */}
          <Main>{children}</Main>
        </div>
      </body>
    </html>
  )
}

// <body className=' grid grid-rows-[5rem,1fr] h-screen '>
// <Header />
// <div className='flex w-screen p-0 top-20 absolute'>
//   {/* <div className='w-2/12 border-r-2 border-slate-300 flex flex-col p-8 h-full'> */}
//   <APINavColumn />
//   {/* </div> */}
//   <Main>{children}</Main>
//   {/* <div className='px-20 pt-8 w-10/12'>{children}</div> */}
// </div>
// </body>

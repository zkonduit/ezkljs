export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <div className='px-4 xs:px-10 sm:px-14 md:px-16 lg:px-20 pt-8 w-full md:w-9/12 overflow-scroll'>
      {children}
    </div>
  )
}

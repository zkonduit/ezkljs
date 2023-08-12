export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <div className='ml-64 p-4 h-[calc(100%-4rem)] lg:pl-40 md:pl-20 sm:pl-10 pl-2'>
      {children}
    </div>
  )
}

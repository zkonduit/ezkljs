import Link from 'next/link'

import { create } from 'zustand'

export type OpenAPINavStore = {
  open: boolean
  setOpen: () => void
}

export const useAPINavColumnStore = create<{
  open: boolean
  setOpen: () => void
}>((set) => ({
  open: false,
  setOpen: () => set((state) => ({ open: !state.open })),
}))

export default function APINavColumn() {
  return (
    <div
      className={`bg-white border-r-2 border-slate-300 w-64 p-4 fixed z-[100] top-16 left-0 overflow-y-auto h-[calc(100%-4rem)]`}
    >
      <ul className='fixed h-full'>
        <li className='h-14 text-slate-500'>
          <Link href='/hub'>What is EZKL Hub?</Link>
        </li>
        <li className='h-14 text-slate-500'>
          <Link href='/health-check'>Health Check</Link>
        </li>
        <li className='h-14 text-slate-500'>
          <Link href='/artifacts'>Artifacts</Link>
        </li>
        <li className='h-14 text-slate-500'>
          <Link href='/upload-artifact'>Upload Artifact</Link>
        </li>
        <li className='h-14 text-slate-500'>
          <Link href='/prove'>Prove</Link>
        </li>
      </ul>
    </div>
  )
}

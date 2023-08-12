'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { create } from 'zustand'
import { useEffect } from 'react'

export type OpenAPINavStore = {
  open: boolean
  setOpen: () => void
}

type Store = {
  open: boolean
  setOpen: (open: boolean) => void
}

export const useAPINavColumnStore = create<Store>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
}))

export default function APINavColumn() {
  const open = useAPINavColumnStore((state) => state.open)
  const setOpen = useAPINavColumnStore((state) => state.setOpen)
  useEffect(() => {
    setOpen(false)
  }, [setOpen])
  const pathname = usePathname()
  useEffect(() => {
    setOpen(false)
  }, [pathname])
  return (
    <>
      <div>
        {/* Wide screen side nav */}
        <div
          className={`bg-white border-r-2 border-slate-300 w-64  fixed z-[100] top-16 left-0 overflow-y-auto h-[calc(100%-4rem)] hidden md:block`}
        >
          <NavList />
        </div>
        {/* Narrow Screen SideNav */}
        <div
          className={`${
            open ? 'translate-x-0' : 'translate-x-[-16rem]'
          } fixed inset-0 z-[200] bg-white border-r-2 border-slate-300 w-64 transition-transform ease-in-out duration-300 md:hidden`}
        >
          <div className='h-16 border-b-2 border-slate-300 items-center flex'>
            <FontAwesomeIcon
              icon={faX}
              onClick={() => setOpen(false)}
              className='w-4 ml-4 md:hidden'
            />
          </div>
          <NavList />
        </div>
        <div
          className={`${
            open
              ? 'bg-opacity-50 md:hidden bg-gray-700'
              : 'bg-opacity-10 hidden bg-gray-300'
          } transition-all ease-in-out duration-700 fixed inset-0 z-[150] `}
          onClick={() => setOpen(false)}
        />
      </div>
    </>
  )
}

function NavList() {
  return (
    <ul className='fixed h-full pt-8 lg:pl-10 pl-6 '>
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
  )
}

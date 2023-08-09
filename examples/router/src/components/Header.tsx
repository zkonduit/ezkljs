'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faX } from '@fortawesome/free-solid-svg-icons'

import TopNav from './TopNav'

import { useAPINavColumnStore } from '@/components/APINavColumn'

// const { open, setOpen } = useAPINavColumnStore.getState()

export default function Header() {
  // const { open, setOpen } = useAPINavColumnStore()
  const { open, setOpen } = useAPINavColumnStore()
  return (
    <div className='flex justify-between h-20 border-b-2 border-slate-300 p-8 items-center fixed inset-0 z-10 bg-white'>
      {/* left */}
      <div className='w-full md:w-2/12 flex'>
        {!open ? (
          <FontAwesomeIcon
            icon={faBars}
            onClick={() => {
              setOpen()
            }}
            className='w-4 mr-2 md:hidden'
          />
        ) : (
          <FontAwesomeIcon
            icon={faX}
            onClick={setOpen}
            className='w-4 mr-2 md:hidden'
          />
        )}
        <h1>EZKL Hub</h1>
      </div>
      {/* right */}

      <TopNav />
    </div>
  )
}

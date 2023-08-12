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
    <div className='bg-white fixed w-full top-0 left-0 z-50 h-16  border-b-2 border-slate-300  lg:px-10 md:px-6 sm:px-4 px-2  flex items-center justify-between'>
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

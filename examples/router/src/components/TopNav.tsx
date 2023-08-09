import Link from 'next/link'

export default function TopNav() {
  return (
    <div className='w-8/12 md:w-5/12 sm:flex justify-between hidden'>
      <Link href='https://docs.ezkl.xyz/'>Website</Link>
      <Link href='https://github.com/zkonduit/ezkl'>Github</Link>
      <Link href='https://github.com/zkonduit/ezkl'>Community</Link>
    </div>
  )
}

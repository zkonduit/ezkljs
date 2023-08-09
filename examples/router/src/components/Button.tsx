interface Props {
  children: string
  onClick: () => void
  className?: string
}

export default function Button({ children, onClick, className }: Props) {
  return (
    <button
      className={`bg-slate-500 text-white p-2 rounded ${
        className ? className : ''
      }`}
      onClick={onClick}
    >
      Check Hub Status
    </button>
  )
}

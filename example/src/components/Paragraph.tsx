import React from 'react'

export default function Paragraph({
  children,
  className,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <p className={`py-8 ${className ? className : ''}`}>{children}</p>
}

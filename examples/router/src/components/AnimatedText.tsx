import React, { useState, useEffect } from 'react'

function AnimateText() {
  const text = 'This is the text being animated from left to right.'
  const [visibleChars, setVisibleChars] = useState(0)
  const speed = 100 // You can adjust this for typing speed

  useEffect(() => {
    if (visibleChars < text.length) {
      const timer = setTimeout(() => {
        setVisibleChars(visibleChars + 1)
      }, speed)

      return () => clearTimeout(timer) // Cleanup timer
    }
  }, [visibleChars])

  return (
    <div className='font-mono'>
      {text.slice(0, visibleChars)}
      {/* Blinking cursor effect at the end */}
      <span className='animate-blink inline-block mx-1'>|</span>
    </div>
  )
}

export default AnimateText

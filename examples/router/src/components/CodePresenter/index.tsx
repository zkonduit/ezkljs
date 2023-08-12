import React, { useState, useEffect } from 'react'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/atom-one-light.css'

hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('json', json)

interface CodePresenterProps {
  input: string
  language: string
  callback?: () => void
  speed?: number
}

const ENTITIES = {
  '&quot;': '"',
  '&#39;': "'",
  '&#x27;': "'",
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&',
} as const

function decodeHtmlEntity(str: string) {
  type EntityKeys = keyof typeof ENTITIES

  return str.replace(
    new RegExp(Object.keys(ENTITIES).join('|'), 'g'),
    (match) => ENTITIES[match as EntityKeys],
  )
}

export default function CodePresenter({
  // animate,
  callback,
  ...props
}: CodePresenterProps) {
  return callback ? (
    <AnimatedCodePresenter {...props} callback={callback} />
  ) : (
    <StaticCodePresenter {...props} />
  )
}

function StaticCodePresenter({
  input,
  language,
}: Omit<CodePresenterProps, 'animate'>) {
  const highlightedCode = hljs.highlight(input, {
    language,
  }).value

  return (
    <div className='hljs p-6 rounded-xl'>
      <pre>
        <code
          dangerouslySetInnerHTML={{
            __html: highlightedCode,
          }}
        />
      </pre>
    </div>
  )
}

type CodeChar = {
  type: 'text' | 'span'
  class?: string
  value: string
}

function AnimatedCodePresenter({
  input,
  language,
  callback,
  speed = 50,
}: CodePresenterProps & { callback: () => void }) {
  const [visibleChars, setVisibleChars] = useState(0)
  const highlightedCode = hljs.highlight(input, { language }).value
  const codeCharRegex = /<span className="(.*?)">([^<]*)<\/span>|([^<]+)/g

  let match
  const codeChars: CodeChar[] = []
  while ((match = codeCharRegex.exec(highlightedCode))) {
    if (match[3]) {
      codeChars.push({ type: 'text', value: decodeHtmlEntity(match[3]) })
    } else if (match[2]) {
      for (const char of decodeHtmlEntity(match[2])) {
        codeChars.push({ type: 'span', class: match[1], value: char })
      }
    }
  }

  const TYPING_SPEED = speed

  const [hasCalledback, setHasCalledback] = useState(false)

  useEffect(() => {
    if (visibleChars < codeChars.length) {
      const timer = setTimeout(() => {
        setVisibleChars((prev) => prev + 1)
      }, TYPING_SPEED)
      return () => clearTimeout(timer)
    } else if (visibleChars === codeChars.length && !hasCalledback) {
      callback()
      setHasCalledback(true)
    }
  }, [visibleChars, codeChars.length, callback, hasCalledback])
  return (
    <div className='hljs p-6 rounded-xl'>
      <pre>
        <code>
          {codeChars.map((char, index) => {
            const isCurrentChar = index === visibleChars - 1
            return (
              <React.Fragment key={index}>
                <span
                  className={char.type === 'span' ? char.class : undefined}
                  style={{
                    opacity: index < visibleChars ? 1 : 0,
                    transition: 'opacity 0ms step-end',
                  }}
                >
                  {char.value}
                </span>
                {isCurrentChar && (
                  <span className='animate-blink inline-block mx-1'>|</span>
                )}
              </React.Fragment>
            )
          })}
        </code>
      </pre>
    </div>
  )
}

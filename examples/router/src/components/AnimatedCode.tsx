import React, { useState, useEffect } from 'react'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/atom-one-light.css'

hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('json', json)

type CodeChar =
  | { type: 'text'; value: string }
  | { type: 'span'; class: string; value: string }

interface AnimatedCodePresenterProps {
  input: string
  language: string
}

const decodeHtmlEntity = (str: string) => {
  const entities = {
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
  } as const

  type EntityKeys = keyof typeof entities

  return str.replace(
    new RegExp(Object.keys(entities).join('|'), 'g'),
    (match) => entities[match as EntityKeys]
  )
}

export default function AnimatedCodePresenter({
  input,
  language,
}: AnimatedCodePresenterProps) {
  const [visibleChars, setVisibleChars] = useState(0)

  const highlightedCode = hljs.highlight(input, { language }).value
  const codeCharRegex = /<span class="(.*?)">([^<]*)<\/span>|([^<]+)/g

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

  const TYPING_SPEED = 50

  useEffect(() => {
    if (visibleChars < codeChars.length) {
      const timer = setTimeout(() => {
        setVisibleChars((prev) => prev + 1)
      }, TYPING_SPEED)
      return () => clearTimeout(timer)
    }
  }, [visibleChars, codeChars.length])

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

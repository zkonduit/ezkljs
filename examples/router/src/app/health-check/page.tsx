'use client'
import { useSpring, animated } from 'react-spring'
import { useState } from 'react'
import CodePresenter from '@/components/CodePresenter'
import hub from '@ezkljs/hub'
import Title from '@/components/PageTitle'
import Paragraph from '@/components/Paragraph'
import Button from '@/components/Button'

const healthCheckSnippet = `import hub from '@ezkljs/hub'

async function checkHealth() {
  const health = await hub.checkHealth()
  console.log(health)
}`

type HealthStatus = {
  res: "Welcome to the ezkl hub's backend!"
  status: 'ok'
}

export default function HealthCheck() {
  return (
    <div className='flex flex-col h-full'>
      <Title>Health Check</Title>
      <Paragraph>
        It's likely that your app may need to check the status of the hub
        server. This is a simple API call that returns a JSON object with the
        status of the hub server.
      </Paragraph>
      {/* <CodePresenter input={healthCheckSnippet} language='typescript' /> */}
      <TryLive />
    </div>
  )
}

function TryLive() {
  const handleCheckStatus = async () => {
    handleSpin()

    const healthStatus = await hub.healthCheck()

    if (
      healthStatus?.res === "Welcome to the ezkl hub's backend!" &&
      healthStatus?.status === 'ok'
    ) {
      const validatedHealthStatus: HealthStatus = {
        res: healthStatus.res,
        status: healthStatus.status,
      }

      setHealthStatus(validatedHealthStatus)
    }

    // Increment animationKey every time new data is fetched
    setAnimationKey((prevKey) => prevKey + 1)

    if (healthStatus?.status === 'ok') {
      setHealth('green')
      // setLastHealthyTime(new Date())
    } else {
      setHealth('red')
    }
  }

  const handleSpin = () => {
    setSpin(true)
    setDegree(degree + 360)
  }

  const [spin, setSpin] = useState(false)
  const [degree, setDegree] = useState(0)
  const [health, setHealth] = useState<'green' | 'red' | 'hidden'>('hidden')
  const [healthStatus, setHealthStatus] = useState<HealthStatus>()
  const [lastHealthyTime, setLastHealthyTime] = useState<Date | null>(null)

  const spinningEffect = useSpring({
    transform: `rotate(${degree}deg)`,
    config: { tension: 100, friction: 70 },
    reset: spin,
    onRest: () => {
      setSpin(false)
    },
  })

  const [animationKey, setAnimationKey] = useState(0)

  const formattedDate = lastHealthyTime
    ? new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(lastHealthyTime)
    : null

  return (
    <div className='w-fit'>
      <Paragraph>Try it out</Paragraph>
      <div className='flex items-center mb-8'>
        <Button onClick={handleCheckStatus}>Check Hub Status</Button>
        {health !== 'hidden' && (
          <div className='relative w-8 h-8 mx-4'>
            <div
              className={`w-8 h-8 rounded-full overflow-hidden relative ${
                health === 'green' ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              <animated.div
                style={spinningEffect}
                className='absolute inset-0 bg-gradient-to-l from-transparent via-blue-200 to-transparent opacity-60'
              />
            </div>
          </div>
        )}
      </div>
      {healthStatus?.status && (
        <CodePresenter
          callback={() => setLastHealthyTime(new Date())}
          key={animationKey} // Attach the key here
          input={JSON.stringify(healthStatus, null, 2)}
          language='json'
        />
      )}
      <>
        {formattedDate && (
          <Paragraph className='text-lg text-gray-700 font-medium pb-2 mb-4'>
            Last healthy time:{' '}
            <span className='text-blue-600'>{formattedDate}</span>
          </Paragraph>
        )}
      </>
    </div>
  )
}

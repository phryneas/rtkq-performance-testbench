import { ChangeEventHandler, useState } from 'react'
import './styles.css'
import pkg from '../package.json'
import { config } from './store'
import { StrictMode, Fragment, Profiler } from 'react'
import * as RtkQuery from './rtk-query'
import * as ReactQuery from './react-query'
import * as Swr from './swr'

function useNumberValue(
  initialValue: number,
  afterChange?: (value: number) => void
) {
  const [value, setState] = useState(initialValue)
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.currentTarget.valueAsNumber
    setState(value)
    afterChange?.(value)
  }
  return { value, onChange }
}

function useBooleanValue(initialValue: boolean) {
  const [checked, setState] = useState(initialValue)
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState(e.currentTarget.checked)
  }
  return { checked, onChange }
}

function useStringValue(initialValue: string) {
  const [value, setState] = useState(initialValue)
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState(e.currentTarget.value)
  }
  return { value, onChange }
}

const onRenderCallback: React.ProfilerOnRenderCallback = (
  id, // the "id" prop of the Profiler tree that has just committed
  phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
  actualDuration, // time spent rendering the committed update
  baseDuration, // estimated time to render the entire subtree without memoization
  startTime, // when React began rendering this update
  commitTime, // when React committed this update
  interactions // the Set of interactions belonging to this update
) => {
  console.log(`update of type ${phase} took ${actualDuration}ms`, {
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions,
  })
}

const getFramework = (framework: string) => {
  switch (framework) {
    case 'rtk-query':
      return [RtkQuery, pkg.dependencies['@reduxjs/toolkit']] as const
    case 'react-query':
      return [ReactQuery, pkg.dependencies['@tanstack/react-query']] as const
    case 'swr':
      return [Swr, pkg.dependencies['swr']] as const
    default:
      throw new Error(`Unknown framework: ${framework}`)
  }
}

export default function App() {
  const numberOfChildren = useNumberValue(10)
  const strictMode = useBooleanValue(false)
  const individualQueries = useBooleanValue(true)
  const responseTimesFrom = useNumberValue(
    config.minimumRequestDuration,
    (v) => (config.minimumRequestDuration = v)
  )
  const responseTimesTo = useNumberValue(
    config.maximumRequestDuration,
    (v) => (config.maximumRequestDuration = v)
  )
  const childrenMounted = useBooleanValue(true)
  const skip = useBooleanValue(false)
  const prefix = useStringValue('test')
  const [framework, setFramework] = useState('rtk-query')
  const StrictWrapper = strictMode ? StrictMode : Fragment

  const [{ Child, Invalidate }, version] = getFramework(framework)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '95vh',
      }}
    >
      <h1>RTK Perf test</h1>
      <p>Version: {version}</p>
      <label>
        framework:{' '}
        <select
          onChange={(event) => setFramework(event.target.value)}
          value={framework}
        >
          <option value="rtk-query">RTK Query</option>
          <option value="react-query">React Query</option>
          <option value="swr">SWR</option>
        </select>
      </label>
      <label>
        number of children: <br /> <input type="number" {...numberOfChildren} />
      </label>
      <label>
        prefix: <br /> <input type="text" {...prefix} />
      </label>
      <label>
        <input type="checkbox" {...strictMode} />
        strict mode
      </label>
      <label>
        <input type="checkbox" {...individualQueries} />
        individual query per child
      </label>
      <label>
        <input type="checkbox" {...childrenMounted} />
        children mounted
      </label>
      <label>
        <input type="checkbox" {...skip} />
        skip
      </label>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        response times: (ms)&nbsp;
        <label>
          from <input type="number" {...responseTimesFrom} />
        </label>
        <label>
          to <input type="number" {...responseTimesTo} />
        </label>
      </div>
      <Invalidate />
      <StrictWrapper>
        <Profiler id="children" onRender={onRenderCallback}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              overflow: 'scroll',
            }}
          >
            {childrenMounted.checked &&
              new Array(numberOfChildren.value).fill(null).map((_, idx) => {
                return (
                  <Child
                    key={idx}
                    skip={skip.checked}
                    arg={`${prefix.value}-${
                      individualQueries.checked ? `${idx}-` : ''
                    }`}
                  />
                )
              })}
          </div>
        </Profiler>
      </StrictWrapper>
    </div>
  )
}

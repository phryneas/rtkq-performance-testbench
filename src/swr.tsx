import { baseQuery } from './store'
import useSWR, { mutate } from 'swr'

export function Child({ arg, skip }: { arg: string; skip: boolean }) {
  const result = useSWR(skip ? null : arg, () => baseQuery(arg))

  return (
    <div>
      {result.isLoading
        ? 'isLoading'
        : skip
        ? 'uninitialized'
        : `${result.data?.data} ${result.isValidating ? '(fetching)' : ''}`}
    </div>
  )
}

export const Invalidate = () => {
  return <button onClick={() => mutate(() => true)}>invalidate</button>
}

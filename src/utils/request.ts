export default async function request<TData>(
  url: string,
  options: RequestInit & {
    unwrapData?: boolean
    logs?: boolean
  } = {
    logs: false,
    unwrapData: false,
  },
): Promise<TData> {
  try {
    const { logs, unwrapData, ...rest } = options
    const response = await fetch(url, rest)

    if (logs) {
      console.log(response)
    }
    const result = await response.json()

    if (unwrapData) {
      const { data } = result
      if (!data) {
        throw new Error('No data')
      }
      return data as TData
    }

    if (!result) {
      throw new Error('No result')
    }

    return result as TData
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error(String(error))
    }
  }
}

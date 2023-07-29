export default async function request<TData>(
  url: string,
  options: RequestInit = {},
  logs = false
): Promise<TData> {
  try {
    const response = await fetch(url, options);
    if (logs) {
      console.log(response);
    }
    const { data } = await response.json();
    return data as TData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

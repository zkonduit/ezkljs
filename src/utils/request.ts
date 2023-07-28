export default async function request<TData>(
  url: string,
  options: RequestInit = {}
): Promise<TData> {
  try {
    const response = await fetch(url, options);
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

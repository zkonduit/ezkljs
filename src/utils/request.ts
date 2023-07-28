export default async function request<TResponse>(
  url: string,
  options: RequestInit = {}
): Promise<TResponse> {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data as TResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}

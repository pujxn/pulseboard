const BASE_URL = 'https://api.balldontlie.io/v1'

export interface ApiList<T> {
  data: T[]
  meta?: { next_cursor?: number; per_page?: number; total_count?: number }
}

export async function apiFetch<T>(
  path: string,
  params?: Record<string, string | string[]>
): Promise<T> {
  const apiKey = import.meta.env.VITE_BALLDONTLIE_API_KEY as string
  if (!apiKey) throw new Error('VITE_BALLDONTLIE_API_KEY is not configured')

  const url = new URL(`${BASE_URL}${path}`)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        value.forEach((v) => url.searchParams.append(key, v))
      } else {
        url.searchParams.set(key, value)
      }
    }
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: apiKey },
  })

  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`)
  return res.json() as Promise<T>
}

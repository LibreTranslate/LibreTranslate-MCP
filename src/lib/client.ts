const DEFAULT_API_URL = 'https://libretranslate.com'

export interface ClientConfig {
  apiUrl?: string
  apiKey?: string
}

interface DetectResponse {
  language: string
  confidence: number
}

interface TranslateResponse {
  translatedText: string
  detectedLanguage: { language: string; confidence: number },
  alternatives: string[]
}

interface Language {
  code: string
  name: string
}

export async function detectLanguage(text: string, config: ClientConfig): Promise<{ language: string; confidence: number }> {
  const apiUrl = config.apiUrl || DEFAULT_API_URL
  const body = new URLSearchParams()
  body.set('q', text)
  if (config.apiKey) body.set('api_key', config.apiKey)

  const res = await fetch(`${apiUrl}/detect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.error || `Detection failed: ${res.status} ${res.statusText}`)
  }

  const data: DetectResponse[] = await res.json()
  if (!data || data.length === 0) {
    throw new Error('No detection result returned')
  }
  return data[0]
}

export async function translate(
  text: string,
  source: string,
  target: string,
  config: ClientConfig
): Promise<TranslateResponse> {
  const apiUrl = config.apiUrl || DEFAULT_API_URL
  const body = new URLSearchParams()
  body.set('q', text)
  body.set('source', source)
  body.set('target', target)
  body.set('alternatives', '3')
  if (config.apiKey) body.set('api_key', config.apiKey)
  if (apiUrl === DEFAULT_API_URL && !config.apiKey){
    throw new Error("An API key is required for libretranslate.com (or you need to self-host)");
  }

  const res = await fetch(`${apiUrl}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.error || `Translation failed: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<TranslateResponse>
}

export async function listLanguages(config: ClientConfig): Promise<Language[]> {
  const apiUrl = config.apiUrl || DEFAULT_API_URL
  const res = await fetch(`${apiUrl}/languages`)

  if (!res.ok) {
    throw new Error(`Languages request failed: ${res.status} ${res.statusText}`)
  }

  return res.json() as Promise<Language[]>
}

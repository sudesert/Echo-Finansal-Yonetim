const trimSlash = (s: string) => s.replace(/\/$/, '')

export const getQrShareOrigin = (): string => {
  const qrBase = import.meta.env.VITE_QR_BASE_URL?.trim()
  if (qrBase) return trimSlash(qrBase)
  const deployed = import.meta.env.VITE_DEPLOYED_URL?.trim()
  if (deployed) return trimSlash(deployed)
  if (typeof window === 'undefined') return ''
  const o = window.location.origin
  if (!o || o === 'null' || o.startsWith('file:')) return ''
  return trimSlash(o)
}

export const VIEW_DATA_PATH = '/view-data' as const

const decodeHashParam = (hash: string, name: 'data' | 'payload'): string | null => {
  if (!hash) return null
  const m = new RegExp(`[?&#]${name}=([^&]+)`).exec(hash)
  if (!m?.[1]) return null
  try {
    return decodeURIComponent(m[1])
  } catch {
    return m[1]
  }
}

export const getEncodedExportFromLocation = (search: string, hash: string): string | null => {
  const sp = new URLSearchParams(search)
  const fromData = sp.get('data')
  if (fromData) return fromData
  const fromPayload = sp.get('payload')
  if (fromPayload) return fromPayload
  return decodeHashParam(hash, 'data') ?? decodeHashParam(hash, 'payload')
}

export const buildViewDataUrl = (encodedExport: string): string => {
  let origin = getQrShareOrigin()
  if (!origin && typeof window !== 'undefined') {
    const o = window.location.origin
    if (o && o !== 'null' && !o.startsWith('file:')) {
      origin = trimSlash(o)
    }
  }
  const pathAndQuery = `${VIEW_DATA_PATH}?data=${encodedExport}`
  if (!origin) return pathAndQuery
  return `${origin}${pathAndQuery}`
}

export const isLocalhostOrigin = (): boolean => {
  if (typeof window === 'undefined') return false
  const h = window.location.hostname
  return h === 'localhost' || h === '127.0.0.1' || h === '::1'
}

export const needsLanQrHint = (): boolean =>
  Boolean(import.meta.env.DEV && isLocalhostOrigin() && !import.meta.env.VITE_QR_BASE_URL?.trim())

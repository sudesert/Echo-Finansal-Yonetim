import LZString from 'lz-string'
import type { EchoExportData } from '../store/expense-store'
import { base64ToUtf8, utf8ToBase64 } from './base64-utf8'

const isValidExport = (parsed: unknown): parsed is EchoExportData => {
  if (!parsed || typeof parsed !== 'object') return false
  const o = parsed as Record<string, unknown>
  return typeof o.monthlyIncome === 'number' && Array.isArray(o.transactions)
}

const tryParse = (json: string): EchoExportData | null => {
  try {
    const parsed = JSON.parse(json) as unknown
    if (!isValidExport(parsed)) return null
    return {
      monthlyIncome: parsed.monthlyIncome,
      transactions: parsed.transactions,
      categoryLimits: parsed.categoryLimits ?? {},
    }
  } catch {
    return null
  }
}

const toBase64Url = (standardB64: string) =>
  standardB64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

export const encodeExportPayload = (data: EchoExportData): string => {
  const json = JSON.stringify(data)
  const b64 = utf8ToBase64(json)
  const urlSafe = toBase64Url(b64)
  return encodeURIComponent(urlSafe)
}

export const decodeExportPayload = (raw: string | null): EchoExportData | null => {
  if (!raw?.trim()) return null
  let trimmed = raw.trim()
  if (trimmed.includes(' ') && !trimmed.includes('%')) {
    trimmed = trimmed.replace(/\s/g, '+')
  }

  const tryDecode = (s: string): EchoExportData | null => {
    try {
      const json = base64ToUtf8(s)
      const r = tryParse(json)
      if (r) return r
    } catch {
      /* fall through */
    }
    try {
      const json = base64ToUtf8(decodeURIComponent(s))
      const r = tryParse(json)
      if (r) return r
    } catch {
      /* fall through */
    }
    return null
  }

  const fromLz = LZString.decompressFromEncodedURIComponent(trimmed)
  if (fromLz) {
    const r = tryParse(fromLz)
    if (r) return r
  }

  const direct = tryDecode(trimmed)
  if (direct) return direct

  try {
    const once = decodeURIComponent(trimmed)
    const r = tryDecode(once)
    if (r) return r
  } catch {
    /* fall through */
  }

  return null
}

import { useEffect } from 'react'
import type { EchoExportData } from '../store/expense-store'
import { base64ToUtf8 } from '../utils/base64-utf8'

const parseDataFromUrl = (): EchoExportData | null => {
  const params = new URLSearchParams(window.location.search)
  const dataParam = params.get('data')
  if (!dataParam) return null
  try {
    const decoded = base64ToUtf8(dataParam)
    const parsed = JSON.parse(decoded) as EchoExportData
    if (typeof parsed.monthlyIncome !== 'number' || !Array.isArray(parsed.transactions)) {
      return null
    }
    return {
      monthlyIncome: parsed.monthlyIncome,
      transactions: parsed.transactions,
      categoryLimits: parsed.categoryLimits ?? {},
    }
  } catch {
    return null
  }
}

export const useDataInit = () => {
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return
      const data = parseDataFromUrl()
      if (data) {
        sessionStorage.setItem('echo_pending_import', JSON.stringify(data))
        const url = new URL(window.location.href)
        url.searchParams.delete('data')
        window.history.replaceState({}, '', url.pathname + (url.search || ''))
      }
    } catch {
      /* ignore malformed URL / storage */
    }
  }, [])
}

import { useEffect } from 'react'
import { useExpenseStore, type EchoExportData } from '../store/expense-store'

const parseDataFromUrl = (): EchoExportData | null => {
  const params = new URLSearchParams(window.location.search)
  const dataParam = params.get('data')
  if (!dataParam) return null
  try {
    const decoded = decodeURIComponent(escape(atob(dataParam)))
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
  const loadFromData = useExpenseStore((s) => s.loadFromData)

  useEffect(() => {
    const data = parseDataFromUrl()
    if (data) {
      loadFromData(data)
      const url = new URL(window.location.href)
      url.searchParams.delete('data')
      const cleanUrl = url.pathname + (url.search || '')
      window.history.replaceState({}, '', cleanUrl)
    }
  }, [loadFromData])
}

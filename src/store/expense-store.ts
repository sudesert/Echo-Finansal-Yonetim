import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import type { Transaction, TransactionType } from '../types'
import { isValidTurkishMobile, normalizePhoneKey } from '../utils/phone'

const generateId = (): string => {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
  } catch {
    // ignore
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export const ECHO_DATA_PREFIX = 'echo_data_'

export const ECHO_SESSION_PHONE_KEY = 'echo_session_phone'

export const ECHO_DRAFT_MONTHLY_INCOME_KEY = 'echo_draft_monthly_income'

export interface EchoExportData {
  monthlyIncome: number
  transactions: Transaction[]
  categoryLimits?: Record<string, number>
}

interface UserSlice {
  sessionPhone: string | null
  monthlyIncome: number
  transactions: Transaction[]
  categoryLimits: Record<string, number>
}

const emptySlice = (): UserSlice => ({
  sessionPhone: null,
  monthlyIncome: 0,
  transactions: [],
  categoryLimits: {},
})

const readEchoData = (phoneKey: string): EchoExportData | null => {
  try {
    const raw = localStorage.getItem(`${ECHO_DATA_PREFIX}${phoneKey}`)
    if (!raw) return null
    const p = JSON.parse(raw) as EchoExportData
    if (typeof p.monthlyIncome !== 'number' || !Array.isArray(p.transactions)) return null
    return {
      monthlyIncome: p.monthlyIncome,
      transactions: p.transactions,
      categoryLimits: p.categoryLimits ?? {},
    }
  } catch {
    return null
  }
}

const writeEchoData = (phoneKey: string, data: EchoExportData) => {
  try {
    localStorage.setItem(
      `${ECHO_DATA_PREFIX}${phoneKey}`,
      JSON.stringify({
        monthlyIncome: data.monthlyIncome,
        transactions: data.transactions,
        categoryLimits: data.categoryLimits ?? {},
      })
    )
  } catch {
    /* ignore quota */
  }
}

const applyExportToSlice = (data: EchoExportData): Pick<UserSlice, 'monthlyIncome' | 'transactions' | 'categoryLimits'> => ({
  monthlyIncome: Number(data.monthlyIncome) || 0,
  transactions: (data.transactions ?? []).map((t) => ({
    ...t,
    id: t.id || generateId(),
  })),
  categoryLimits: data.categoryLimits ?? {},
})

interface ExpenseStore extends UserSlice {
  loadPhoneData: (rawPhone: string) => boolean
  clearSession: () => void
  setMonthlyIncome: (value: number) => void
  setCategoryLimit: (category: string, limit: number) => void
  getCategoryLimit: (category: string) => number
  addTransaction: (type: TransactionType, data: Omit<Transaction, 'id' | 'type'>) => void
  removeTransaction: (id: string) => void
  loadFromData: (data: EchoExportData) => void
  exportData: () => EchoExportData
}

const createPersist = (get: () => ExpenseStore) => {
  const save = () => {
    const s = get()
    if (!s.sessionPhone) return
    const txs = Array.isArray(s.transactions) ? s.transactions : []
    writeEchoData(s.sessionPhone, {
      monthlyIncome: Number(s.monthlyIncome) || 0,
      transactions: txs,
      categoryLimits: s.categoryLimits && typeof s.categoryLimits === 'object' ? s.categoryLimits : {},
    })
  }
  return save
}

export const useExpenseStore = create<ExpenseStore>((set, get) => {
  const persist = createPersist(get)

  return {
    ...emptySlice(),
    loadPhoneData: (rawPhone) => {
      const phoneKey = normalizePhoneKey(rawPhone)
      if (!isValidTurkishMobile(phoneKey)) return false

      let merged: EchoExportData | null = null
      try {
        const pendingRaw = sessionStorage.getItem('echo_pending_import')
        if (pendingRaw) {
          const p = JSON.parse(pendingRaw) as EchoExportData
          if (typeof p.monthlyIncome === 'number' && Array.isArray(p.transactions)) {
            merged = {
              monthlyIncome: p.monthlyIncome,
              transactions: p.transactions,
              categoryLimits: p.categoryLimits ?? {},
            }
          }
          sessionStorage.removeItem('echo_pending_import')
        }
      } catch {
        sessionStorage.removeItem('echo_pending_import')
      }

      const saved = readEchoData(phoneKey)
      const base = merged ?? saved ?? { monthlyIncome: 0, transactions: [], categoryLimits: {} }
      const applied = applyExportToSlice(base)
      const prev = get()
      const mergedIncome =
        applied.monthlyIncome > 0 ? applied.monthlyIncome : prev.monthlyIncome

      set({
        sessionPhone: phoneKey,
        ...applied,
        monthlyIncome: mergedIncome,
      })
      try {
        localStorage.removeItem(ECHO_DRAFT_MONTHLY_INCOME_KEY)
      } catch {
        /* ignore */
      }
      persist()
      try {
        localStorage.setItem(ECHO_SESSION_PHONE_KEY, phoneKey)
      } catch {
        /* ignore */
      }

      if (typeof window !== 'undefined' && window.location.search.includes('data=')) {
        const url = new URL(window.location.href)
        url.searchParams.delete('data')
        window.history.replaceState({}, '', url.pathname + (url.search || ''))
      }

      return true
    },
    clearSession: () => {
      try {
        localStorage.removeItem(ECHO_SESSION_PHONE_KEY)
        localStorage.removeItem(ECHO_DRAFT_MONTHLY_INCOME_KEY)
      } catch {
        /* ignore */
      }
      set(emptySlice())
    },
    setMonthlyIncome: (value) => {
      const v = Math.max(0, value)
      set({ monthlyIncome: v })
      const s = get()
      if (s.sessionPhone) {
        try {
          localStorage.removeItem(ECHO_DRAFT_MONTHLY_INCOME_KEY)
        } catch {
          /* ignore */
        }
        persist()
      } else {
        try {
          localStorage.setItem(ECHO_DRAFT_MONTHLY_INCOME_KEY, String(v))
        } catch {
          /* ignore */
        }
      }
    },
    setCategoryLimit: (category, limit) => {
      set((state) => {
        if (!state.sessionPhone) return state
        const categoryLimits = { ...state.categoryLimits }
        if (limit <= 0) delete categoryLimits[category]
        else categoryLimits[category] = limit
        return { categoryLimits }
      })
      if (get().sessionPhone) persist()
    },
    getCategoryLimit: (category) => {
      return get().categoryLimits[category] ?? 0
    },
    addTransaction: (type, data) => {
      const state = get()
      if (!state.sessionPhone) return
      const prev = Array.isArray(state.transactions) ? state.transactions : []
      const tx: Transaction = {
        ...data,
        id: generateId(),
        type,
        category: data.category ?? 'Diğer',
      }
      set({ transactions: [...prev, tx] })
      persist()
    },
    removeTransaction: (id) => {
      const state = get()
      if (!state.sessionPhone) return
      const prev = Array.isArray(state.transactions) ? state.transactions : []
      set({ transactions: prev.filter((t) => t.id !== id) })
      persist()
    },
    loadFromData: (data) => {
      set((state) => {
        if (!state.sessionPhone) return state
        return {
          ...applyExportToSlice(data),
        }
      })
      persist()
    },
    exportData: () => {
      const s = get()
      return {
        monthlyIncome: Number(s.monthlyIncome) || 0,
        transactions: Array.isArray(s.transactions) ? s.transactions : [],
        categoryLimits:
          s.categoryLimits && typeof s.categoryLimits === 'object' ? s.categoryLimits : {},
      }
    },
  }
})

export const selectCurrentUser = (state: ExpenseStore) => ({
  monthlyIncome: Number(state.monthlyIncome) || 0,
  transactions: Array.isArray(state.transactions) ? state.transactions : [],
  categoryLimits:
    state.categoryLimits && typeof state.categoryLimits === 'object' ? state.categoryLimits : {},
})

export const useExpenseUserSlice = () => useExpenseStore(useShallow(selectCurrentUser))

export const hydrateSessionFromStorage = (): void => {
  if (typeof window === 'undefined') return
  try {
    const key = localStorage.getItem(ECHO_SESSION_PHONE_KEY)?.trim()
    if (!key || !isValidTurkishMobile(key)) return
    useExpenseStore.getState().loadPhoneData(key)
  } catch {
    /* ignore */
  }
}

export const hydrateDraftMonthlyIncome = (): void => {
  if (typeof window === 'undefined') return
  try {
    const key = localStorage.getItem(ECHO_SESSION_PHONE_KEY)?.trim()
    if (key && isValidTurkishMobile(key)) return
    const raw = localStorage.getItem(ECHO_DRAFT_MONTHLY_INCOME_KEY)
    if (raw == null) return
    const n = parseFloat(raw)
    if (!isNaN(n) && n >= 0) {
      useExpenseStore.setState({ monthlyIncome: n })
    }
  } catch {
    /* ignore */
  }
}

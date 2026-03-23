import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Transaction, TransactionType } from '../types'

const generateId = () => crypto.randomUUID()

const DEFAULT_USER_ID = 'default'

interface UserData {
  monthlyIncome: number
  transactions: Transaction[]
  categoryLimits: Record<string, number>
}

export interface EchoExportData {
  monthlyIncome: number
  transactions: Transaction[]
  categoryLimits?: Record<string, number>
}

const emptyUserData = (): UserData => ({
  monthlyIncome: 0,
  transactions: [],
  categoryLimits: {},
})

interface ExpenseStore {
  currentUserId: string
  users: Record<string, UserData>
  setCurrentUserId: (id: string) => void
  ensureUser: (id: string) => void
  setMonthlyIncome: (value: number) => void
  setCategoryLimit: (category: string, limit: number) => void
  getCategoryLimit: (category: string) => number
  addTransaction: (type: TransactionType, data: Omit<Transaction, 'id' | 'type'>) => void
  removeTransaction: (id: string) => void
  loadFromData: (data: EchoExportData) => void
  exportData: () => EchoExportData
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      currentUserId: DEFAULT_USER_ID,
      users: { [DEFAULT_USER_ID]: emptyUserData() },
      setCurrentUserId: (id) => {
        set((state) => {
          const users = { ...state.users }
          if (!users[id]) users[id] = emptyUserData()
          return { currentUserId: id, users }
        })
      },
      ensureUser: (id) => {
        set((state) => {
          if (state.users[id]) return state
          return {
            users: { ...state.users, [id]: emptyUserData() },
          }
        })
      },
      setMonthlyIncome: (value) =>
        set((state) => {
          const uid = state.currentUserId || DEFAULT_USER_ID
          const user = state.users[uid] || emptyUserData()
          return {
            users: {
              ...state.users,
              [uid]: { ...user, monthlyIncome: Math.max(0, value) },
            },
          }
        }),
      setCategoryLimit: (category, limit) =>
        set((state) => {
          const uid = state.currentUserId || DEFAULT_USER_ID
          const user = state.users[uid] || emptyUserData()
          const categoryLimits = { ...user.categoryLimits }
          if (limit <= 0) delete categoryLimits[category]
          else categoryLimits[category] = limit
          return {
            users: {
              ...state.users,
              [uid]: { ...user, categoryLimits },
            },
          }
        }),
      getCategoryLimit: (category) => {
        const state = get()
        const uid = state.currentUserId || DEFAULT_USER_ID
        const user = state.users[uid] || emptyUserData()
        return user.categoryLimits[category] ?? 0
      },
      addTransaction: (type, data) =>
        set((state) => {
          const uid = state.currentUserId || DEFAULT_USER_ID
          const user = state.users[uid] || emptyUserData()
          const tx: Transaction = {
            ...data,
            id: generateId(),
            type,
            category: data.category ?? 'Diğer',
          }
          const transactions = [...user.transactions, tx]
          return {
            users: {
              ...state.users,
              [uid]: { ...user, transactions },
            },
          }
        }),
      removeTransaction: (id) =>
        set((state) => {
          const uid = state.currentUserId || DEFAULT_USER_ID
          const user = state.users[uid] || emptyUserData()
          const transactions = user.transactions.filter((t) => t.id !== id)
          return {
            users: {
              ...state.users,
              [uid]: { ...user, transactions },
            },
          }
        }),
      loadFromData: (data) =>
        set((state) => {
          const uid = state.currentUserId || DEFAULT_USER_ID
          const transactions = (data.transactions ?? []).map((t) => ({
            ...t,
            id: t.id || generateId(),
          }))
          return {
            users: {
              ...state.users,
              [uid]: {
                monthlyIncome: Number(data.monthlyIncome) || 0,
                transactions,
                categoryLimits: data.categoryLimits ?? {},
              },
            },
          }
        }),
      exportData: () => {
        const state = get()
        const uid = state.currentUserId || DEFAULT_USER_ID
        const user = state.users[uid] || emptyUserData()
        return {
          monthlyIncome: user.monthlyIncome,
          transactions: user.transactions,
          categoryLimits: user.categoryLimits,
        }
      },
    }),
    { name: 'echo-budget' }
  )
)

export const selectCurrentUser = (state: ExpenseStore) => {
  const uid = state.currentUserId || DEFAULT_USER_ID
  return state.users[uid] || emptyUserData()
}

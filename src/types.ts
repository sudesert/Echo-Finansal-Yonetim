export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  type: TransactionType
  description: string
  amount: number
  date: string
  category?: string
}

export interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
  isRecurring?: boolean
}

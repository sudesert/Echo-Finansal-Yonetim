import type { Transaction } from '../types'

export type SpendingSlice = {
  category: string
  amount: number
  pctOfTotal: number
  barPct: number
}

export const getTopSpendingDistribution = (
  transactions: Transaction[],
  topN = 4
): SpendingSlice[] => {
  const expenses = transactions.filter((t) => t.type === 'expense')
  const total = expenses.reduce((s, t) => s + Math.abs(t.amount || 0), 0)
  if (total <= 0) return []

  const byCat = new Map<string, number>()
  for (const t of expenses) {
    const c = (t.category || 'Diğer').trim() || 'Diğer'
    byCat.set(c, (byCat.get(c) ?? 0) + Math.abs(t.amount || 0))
  }

  const sorted = [...byCat.entries()].sort((a, b) => b[1] - a[1]).slice(0, topN)
  const maxAmount = sorted[0]?.[1] ?? 0

  return sorted.map(([category, amount]) => ({
    category,
    amount,
    pctOfTotal: (amount / total) * 100,
    barPct: maxAmount > 0 ? (amount / maxAmount) * 100 : 0,
  }))
}

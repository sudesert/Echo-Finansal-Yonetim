import type { Transaction } from '../types'

export const sortTransactionsChronological = (list: Transaction[]) =>
  [...list].sort((a, b) => {
    const ta = new Date(a.date).getTime()
    const tb = new Date(b.date).getTime()
    if (ta !== tb) return ta - tb
    return (a.id || '').localeCompare(b.id || '')
  })

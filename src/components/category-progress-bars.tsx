import { useMemo } from 'react'
import { useExpenseUserSlice } from '../store/expense-store'
import { getCategorySpending, getCategoryStatus } from '../utils/category-limits'
import { CATEGORIES } from '../constants/categories'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value)

export const CategoryProgressBars = () => {
  const { transactions, categoryLimits } = useExpenseUserSlice()

  const categoriesWithLimits = useMemo(() => {
    return CATEGORIES.filter((cat) => (categoryLimits[cat] ?? 0) > 0)
  }, [categoryLimits])

  if (categoriesWithLimits.length === 0) return null

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">Kategori Durumları</h3>
      <div className="space-y-2">
        {categoriesWithLimits.map((cat) => {
          const limit = categoryLimits[cat] ?? 0
          const spent = getCategorySpending(transactions, cat)
          const status = getCategoryStatus(spent, limit)
          const pct = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0
          return (
            <div key={cat} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-muted-foreground">{cat}</span>
                <span
                  className={`tabular-nums tracking-tight ${
                    status === 'over'
                      ? 'text-destructive'
                      : status === 'warning'
                        ? 'text-foreground/80'
                        : 'text-muted-foreground'
                  }`}
                >
                  {formatCurrency(spent)} / {formatCurrency(limit)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-echo-brand/20">
                <div
                  className={`h-full transition-all ${
                    status === 'over'
                      ? 'bg-destructive/60'
                      : status === 'warning'
                        ? 'bg-foreground/50'
                        : 'bg-foreground/35'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { useState, useMemo } from 'react'
import { useExpenseStore, useExpenseUserSlice } from '../store/expense-store'
import { getCategorySpending, getCategoryStatus, getMotivationMessage } from '../utils/category-limits'
import type { TransactionType } from '../types'
import { CATEGORIES } from '../constants/categories'

export const TransactionInputCard = () => {
  const sessionPhone = useExpenseStore((s) => s.sessionPhone)
  const addTransaction = useExpenseStore((s) => s.addTransaction)
  const { transactions, categoryLimits } = useExpenseUserSlice()
  const [type, setType] = useState<TransactionType>('expense')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [motivationNote, setMotivationNote] = useState<string | null>(null)
  const today = new Date().toISOString().slice(0, 10)

  const checkResult = useMemo(() => {
    if (type !== 'expense' || !category || !amount) return null
    const cat = category.trim() || 'Diğer'
    const limit = categoryLimits[cat] ?? 0
    if (limit <= 0) return null
    const currentSpent = getCategorySpending(transactions, cat)
    const newTotal = currentSpent + parseFloat(amount || '0')
    const status = getCategoryStatus(newTotal, limit)
    if (status === 'ok') return null
    return { category: cat, status, message: getMotivationMessage(cat, status) }
  }, [type, category, amount, transactions, categoryLimits])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sessionPhone) return
    const parsed = parseFloat(amount)
    if (!description.trim() || isNaN(parsed) || parsed <= 0) return
    const cat = category.trim() || 'Diğer'
    const limit = categoryLimits[cat] ?? 0
    if (limit > 0 && type === 'expense') {
      const currentSpent = getCategorySpending(transactions, cat)
      const newTotal = currentSpent + parsed
      const status = getCategoryStatus(newTotal, limit)
      if (status === 'over' || status === 'warning') {
        setMotivationNote(getMotivationMessage(cat, status))
      }
    }
    addTransaction(type, {
      description: description.trim(),
      amount: parsed,
      date: today,
      category: cat,
    })
    setDescription('')
    setAmount('')
    setCategory('')
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-echo-brand bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
        aria-disabled={!sessionPhone}
      >
        {!sessionPhone && (
          <p className="mb-4 rounded-lg border border-dashed border-echo-brand/50 bg-muted/30 px-3 py-2 text-center text-xs text-muted-foreground">
            İşlem eklemek için önce telefon numaranızla oturum açın.
          </p>
        )}
        <div className="space-y-6">
          <div>
            <label
              htmlFor="tx-description"
              className="block text-sm font-medium text-foreground"
            >
              {type === 'expense' ? 'Ne harcadın?' : 'Ne kazandın?'}
            </label>
            <input
              id="tx-description"
              type="text"
              value={description}
              disabled={!sessionPhone}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                type === 'expense'
                  ? 'Örn: Market, Kira, Benzin...'
                  : 'Örn: Maaş, Freelance, Bonus...'
              }
              aria-label={type === 'expense' ? 'Ne harcadın?' : 'Ne kazandın?'}
              className="mt-2 w-full rounded-xl border border-[0.5px] border-echo-brand/35 bg-background/80 px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors focus:border-echo-brand focus:bg-card focus:outline-none focus:ring-2 focus:ring-echo-brand/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="tx-amount"
                className="block text-sm font-medium text-foreground"
              >
                Ne kadar?
              </label>
              <input
                id="tx-amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                disabled={!sessionPhone}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                aria-label="Ne kadar?"
                className="mt-2 w-full rounded-xl border border-[0.5px] border-echo-brand/35 bg-background/80 px-4 py-3 font-sans tabular-nums text-foreground placeholder:text-muted-foreground transition-colors focus:border-echo-brand focus:bg-card focus:outline-none focus:ring-2 focus:ring-echo-brand/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="flex gap-2 sm:shrink-0">
              <button
                type="button"
                disabled={!sessionPhone}
                onClick={() => setType('income')}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-colors sm:flex-none ${
                  type === 'income'
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-500/50 shadow-sm'
                    : 'bg-muted text-emerald-800/90 hover:bg-emerald-50'
                }`}
              >
                Gelir
              </button>
              <button
                type="button"
                disabled={!sessionPhone}
                onClick={() => setType('expense')}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-colors sm:flex-none ${
                  type === 'expense'
                    ? 'bg-red-600 text-white ring-2 ring-red-500/50 shadow-sm'
                    : 'bg-muted text-red-800/90 hover:bg-red-50'
                }`}
              >
                Harcama
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="tx-category"
              className="block text-sm font-medium text-foreground"
            >
              Kategori
            </label>
            <select
              id="tx-category"
              value={category}
              disabled={!sessionPhone}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[0.5px] border-echo-brand/35 bg-background/80 px-4 py-3 text-foreground transition-colors focus:border-echo-brand focus:bg-card focus:outline-none focus:ring-2 focus:ring-echo-brand/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Seçin</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          {checkResult && (
            <div
              className={`rounded-xl px-4 py-3 text-sm ${
                checkResult.status === 'over'
                  ? 'bg-muted text-foreground ring-1 ring-border'
                  : 'bg-muted/70 text-muted-foreground ring-1 ring-border/80'
              }`}
              role="alert"
            >
              {checkResult.message}
            </div>
          )}
          <button
            type="submit"
            disabled={!sessionPhone || !description.trim() || !amount || parseFloat(amount) <= 0}
            className="w-full rounded-xl border border-[0.5px] border-echo-brand/60 bg-echo-brand px-4 py-3 font-medium text-echo-canvas transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ekle
          </button>
        </div>
      </form>
      {motivationNote && (
        <div
          className="mt-3 rounded-xl border border-echo-brand/45 bg-muted/50 px-4 py-3 text-sm text-foreground"
          role="alert"
        >
          {motivationNote}
          <button
            type="button"
            onClick={() => setMotivationNote(null)}
            className="ml-2 text-muted-foreground underline-offset-2 hover:underline"
          >
            Kapat
          </button>
        </div>
      )}
    </div>
  )
}

import { useState, useMemo } from 'react'
import { useExpenseStore } from '../store/expense-store'
import { selectCurrentUser } from '../store/expense-store'
import { getCategorySpending, getCategoryStatus, getMotivationMessage } from '../utils/category-limits'
import type { TransactionType } from '../types'
import { CATEGORIES } from '../constants/categories'

export const TransactionInputCard = () => {
  const addTransaction = useExpenseStore((s) => s.addTransaction)
  const { transactions, categoryLimits } = useExpenseStore(selectCurrentUser)
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
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/50 transition-shadow hover:shadow-xl"
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="tx-description"
              className="block text-sm font-medium text-slate-700"
            >
              {type === 'expense' ? 'Ne harcadın?' : 'Ne kazandın?'}
            </label>
            <input
              id="tx-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                type === 'expense'
                  ? 'Örn: Market, Kira, Benzin...'
                  : 'Örn: Maaş, Freelance, Bonus...'
              }
              aria-label={type === 'expense' ? 'Ne harcadın?' : 'Ne kazandın?'}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 placeholder-slate-400 transition-colors focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="tx-amount"
                className="block text-sm font-medium text-slate-700"
              >
                Ne kadar?
              </label>
              <input
                id="tx-amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                aria-label="Ne kadar?"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 placeholder-slate-400 transition-colors focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div className="flex gap-2 sm:shrink-0">
              <button
                type="button"
                onClick={() => setType('income')}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-colors sm:flex-none ${
                  type === 'income'
                    ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Gelir
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-colors sm:flex-none ${
                  type === 'expense'
                    ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Harcama
              </button>
            </div>
          </div>
          <div>
            <label
              htmlFor="tx-category"
              className="block text-sm font-medium text-slate-700"
            >
              Kategori
            </label>
            <select
              id="tx-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-800 transition-colors focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200"
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
                  ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-200'
                  : 'bg-amber-50/70 text-amber-700 ring-1 ring-amber-100'
              }`}
              role="alert"
            >
              {checkResult.message}
            </div>
          )}
          <button
            type="submit"
            disabled={!description.trim() || !amount || parseFloat(amount) <= 0}
            className={`w-full rounded-xl px-4 py-3 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              type === 'expense'
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            Ekle
          </button>
        </div>
      </form>
      {motivationNote && (
        <div
          className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          role="alert"
        >
          {motivationNote}
          <button
            type="button"
            onClick={() => setMotivationNote(null)}
            className="ml-2 text-amber-600 hover:underline"
          >
            Kapat
          </button>
        </div>
      )}
    </div>
  )
}

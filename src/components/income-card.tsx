import { useState } from 'react'
import { useExpenseStore, selectCurrentUser } from '../store/expense-store'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value)

export const IncomeCard = () => {
  const monthlyIncome = useExpenseStore((s) => selectCurrentUser(s).monthlyIncome)
  const setMonthlyIncome = useExpenseStore((s) => s.setMonthlyIncome)
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(String(monthlyIncome || ''))

  const handleSave = () => {
    const parsed = parseFloat(inputValue)
    if (!isNaN(parsed) && parsed >= 0) {
      setMonthlyIncome(parsed)
    } else {
      setInputValue(String(monthlyIncome))
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') {
      setInputValue(String(monthlyIncome))
      setIsEditing(false)
    }
  }

  return (
    <div
      className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-lg shadow-indigo-100/50 md:p-8"
      role="region"
      aria-label="Aylık gelir"
    >
      <h2 className="text-sm font-medium uppercase tracking-wider text-indigo-600">
        Aylık Toplam Gelir (Sabit)
      </h2>
      {isEditing ? (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            min="0"
            step="100"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            aria-label="Aylık gelir"
            className="max-w-[200px] rounded-xl border-2 border-indigo-200 bg-white px-4 py-3 text-2xl font-bold text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <span className="text-xl font-semibold text-slate-600">₺</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setInputValue(String(monthlyIncome || ''))
            setIsEditing(true)
          }}
          className="mt-3 block text-left text-3xl font-bold text-indigo-700 transition-colors hover:text-indigo-800 md:text-4xl"
        >
          {monthlyIncome > 0 ? formatCurrency(monthlyIncome) : 'Gelirini gir'}
        </button>
      )}
      <p className="mt-2 text-xs text-slate-500">
        Maaş vb. sabit gelir — ek gelirler aşağıdaki tablodan eklenir
      </p>
    </div>
  )
}

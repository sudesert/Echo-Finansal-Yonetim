import { useState, type KeyboardEvent } from 'react'
import { useExpenseStore } from '../store/expense-store'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value)

export const MonthlyIncomeField = () => {
  const monthlyIncome = useExpenseStore((s) => s.monthlyIncome)
  const setMonthlyIncome = useExpenseStore((s) => s.setMonthlyIncome)
  const [isEditing, setIsEditing] = useState(false)
  const [inputValue, setInputValue] = useState(String(monthlyIncome || ''))

  const handleSave = () => {
    const parsed = parseFloat(inputValue.replace(',', '.'))
    if (!isNaN(parsed) && parsed >= 0) {
      setMonthlyIncome(parsed)
    } else {
      setInputValue(String(monthlyIncome))
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') {
      setInputValue(String(monthlyIncome))
      setIsEditing(false)
    }
  }

  return (
    <div role="group" aria-label="Aylık toplam gelir">
      <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Aylık Toplam Gelir (Sabit)
      </h2>
      {isEditing ? (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            min="0"
            step="100"
            inputMode="decimal"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            aria-label="Aylık gelir tutarı"
            className="max-w-[200px] rounded-xl border border-[0.5px] border-echo-brand bg-background px-4 py-3 text-2xl font-bold tabular-nums tracking-tight text-foreground focus:border-echo-brand focus:outline-none focus:ring-2 focus:ring-echo-brand/25"
          />
          <span className="text-xl font-semibold text-muted-foreground">₺</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            setInputValue(String(monthlyIncome || ''))
            setIsEditing(true)
          }}
          className="mt-3 block w-full text-left text-3xl font-bold tabular-nums tracking-tight text-foreground transition-opacity hover:opacity-90 md:text-4xl"
        >
          {monthlyIncome > 0 ? formatCurrency(monthlyIncome) : 'Gelirini gir'}
        </button>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        Maaş vb. sabit gelir — ek gelirler aşağıdaki tablodan eklenir
      </p>
    </div>
  )
}

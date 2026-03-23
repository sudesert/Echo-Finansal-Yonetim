import { useState } from 'react'
import { useExpenseStore, selectCurrentUser } from '../store/expense-store'
import { CATEGORIES } from '../constants/categories'

export const LimitSettingsPanel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { categoryLimits } = useExpenseStore(selectCurrentUser)
  const setCategoryLimit = useExpenseStore((s) => s.setCategoryLimit)
  const [editing, setEditing] = useState<Record<string, string>>({})

  const handleSave = (category: string) => {
    const val = editing[category]
    if (val === undefined) return
    const parsed = parseFloat(val)
    setCategoryLimit(category, isNaN(parsed) || parsed < 0 ? 0 : parsed)
    setEditing((e) => {
      const next = { ...e }
      delete next[category]
      return next
    })
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
      >
        Limit Ayarları
      </button>
      {isOpen && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
          <h3 className="mb-3 text-sm font-semibold text-slate-800">Kategori Limitleri</h3>
          <p className="mb-4 text-xs text-slate-500">
            Aylık harcama limitlerini belirle. %90&apos;a ulaşınca uyarı alırsın.
          </p>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => {
              const limit = categoryLimits[cat] ?? 0
              const isEditing = editing[cat] !== undefined
              const displayVal = isEditing ? editing[cat] : (limit > 0 ? String(limit) : '')
              return (
                <div
                  key={cat}
                  className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2"
                >
                  <span className="text-sm font-medium text-slate-700">{cat}</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={displayVal}
                      onChange={(e) =>
                        setEditing((prev) => ({ ...prev, [cat]: e.target.value }))
                      }
                      onBlur={() => handleSave(cat)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSave(cat)}
                      placeholder="Limit"
                      className="w-28 rounded border border-slate-200 px-2 py-1.5 text-sm"
                    />
                    <span className="text-xs text-slate-400">₺/ay</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

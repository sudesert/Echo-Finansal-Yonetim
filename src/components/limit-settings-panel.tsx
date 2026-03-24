import { useState } from 'react'
import { useExpenseStore, useExpenseUserSlice } from '../store/expense-store'
import { CATEGORIES } from '../constants/categories'

export const LimitSettingsPanel = () => {
  const sessionPhone = useExpenseStore((s) => s.sessionPhone)
  const [panelOpen, setPanelOpen] = useState(false)
  const [limitInfoOpen, setLimitInfoOpen] = useState(false)
  const { categoryLimits } = useExpenseUserSlice()
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

  const limitCount = CATEGORIES.filter((c) => (categoryLimits[c] ?? 0) > 0).length

  return (
    <div className="rounded-xl border border-[0.5px] border-echo-brand/35 bg-muted/20 p-4 md:p-5">
      <button
        type="button"
        onClick={() => setPanelOpen((o) => !o)}
        aria-expanded={panelOpen}
        className="flex w-full items-start gap-2 rounded-lg border border-echo-brand/50 bg-echo-brand/[0.05] px-3 py-2.5 text-left transition hover:bg-echo-brand/[0.08] focus-visible:outline focus-visible:ring-2 focus-visible:ring-echo-brand/40"
      >
        <span className="mt-0.5 shrink-0 text-lg leading-none text-echo-brand" aria-hidden>
          ⓘ
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">Limit ayarları</span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {panelOpen
              ? 'Kapatmak için tıklayın'
              : limitCount > 0
                ? `${limitCount} kategoride limit tanımlı — düzenlemek için açın`
                : 'İsteğe bağlı; sadece limit kullanacaksanız açıp değer girin'}
          </span>
        </span>
        <span
          className={`shrink-0 text-echo-brand transition-transform ${panelOpen ? 'rotate-180' : ''}`}
          aria-hidden
        >
          ▼
        </span>
      </button>

      {panelOpen && (
        <div className="mt-4 space-y-4 border-t border-echo-brand/35 pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Kategori başına aylık üst sınır (₺). Tanımladığınız limitlere göre aşağıda harcama çubukları
              görünür.
            </p>
            <button
              type="button"
              onClick={() => setLimitInfoOpen((o) => !o)}
              aria-expanded={limitInfoOpen}
              className="flex w-full shrink-0 items-center justify-center gap-2 rounded-lg border border-[0.5px] border-echo-brand/50 bg-echo-brand/[0.06] px-3 py-2 text-sm font-medium text-foreground transition hover:bg-echo-brand/[0.1] focus-visible:outline focus-visible:ring-2 focus-visible:ring-echo-brand/40 sm:w-auto sm:min-w-[10rem]"
            >
              <span className="text-echo-brand" aria-hidden>
                ⓘ
              </span>
              Bilgi
              <span
                className={`text-echo-brand transition-transform ${limitInfoOpen ? 'rotate-180' : ''}`}
                aria-hidden
              >
                ▼
              </span>
            </button>
          </div>

          {limitInfoOpen && (
            <div
              role="region"
              className="rounded-lg border border-echo-brand/45 bg-card px-3 py-3 text-sm text-muted-foreground shadow-sm"
            >
              <p>
                Her kategori için bu ay içinde harcayabileceğiniz üst tutarı yazarsınız. İşlemlerinizdeki
                giderler kategoriye göre toplanır; toplam, limite yaklaştığında veya aştığında çubuk rengi
                değişir. Limitin yaklaşık{' '}
                <span className="font-medium text-foreground">%90&apos;ına</span> gelindiğinde uyarı durumu
                kullanılır.
              </p>
              <p className="mt-2">
                Limit girmediğiniz kategoriler aşağıdaki &quot;Kategori durumları&quot; bölümünde yer almaz;
                önce limit tanımlayın.
              </p>
            </div>
          )}

          <div className="space-y-2">
            {CATEGORIES.map((cat) => {
              const limit = categoryLimits[cat] ?? 0
              const isEditingField = editing[cat] !== undefined
              const displayVal = isEditingField ? editing[cat] : limit > 0 ? String(limit) : ''
              return (
                <div
                  key={cat}
                  className="flex items-center justify-between gap-2 rounded-lg bg-background/60 px-3 py-2"
                >
                  <span className="text-sm font-medium text-foreground">{cat}</span>
                  <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={displayVal}
                  disabled={!sessionPhone}
                  onChange={(e) => setEditing((prev) => ({ ...prev, [cat]: e.target.value }))}
                  onBlur={() => handleSave(cat)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave(cat)}
                  placeholder="Limit"
                  className="w-28 rounded border border-[0.5px] border-echo-brand/35 bg-background px-2 py-1.5 text-sm text-foreground tabular-nums focus:border-echo-brand focus:outline-none focus:ring-2 focus:ring-echo-brand/25 disabled:cursor-not-allowed disabled:opacity-50"
                />
                    <span className="text-xs text-muted-foreground">₺/ay</span>
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

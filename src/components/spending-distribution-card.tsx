import { CategoryMiniIcon } from './category-mini-icon'
import type { SpendingSlice } from '../utils/spending-distribution'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value)

const formatPct = (value: number) =>
  `${new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 }).format(value)}%`

type SpendingDistributionCardProps = {
  slices: SpendingSlice[]
}

export const SpendingDistributionCard = ({ slices }: SpendingDistributionCardProps) => {
  return (
    <div
      className="flex min-h-[13rem] flex-1 flex-col rounded-xl border border-echo-brand/50 bg-[#F8FAFC] p-5 shadow-[0_1px_3px_rgba(15,23,42,0.08),0_4px_12px_rgba(15,23,42,0.04)]"
      aria-label="Harcama dağılımı"
    >
      <h3 className="font-sans text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Harcama Dağılımı
      </h3>
      {slices.length === 0 ? (
        <p className="mt-4 flex flex-1 items-center text-sm text-muted-foreground">
          Gider kaydı eklendiğinde en çok harcanan kategoriler burada listelenir.
        </p>
      ) : (
        <ul className="mt-4 flex flex-1 flex-col justify-center gap-3.5">
          {slices.map((s) => (
            <li key={s.category} className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2 font-sans text-sm font-medium leading-tight text-foreground">
                  <CategoryMiniIcon category={s.category} className="text-echo-brand" />
                  <span className="truncate">{s.category}</span>
                </span>
                <span className="shrink-0 font-mono text-[11px] tabular-nums tracking-tight text-echo-ink md:text-xs">
                  {formatPct(s.pctOfTotal)} · {formatCurrency(s.amount)}
                </span>
              </div>
              <div className="h-[3px] w-full overflow-hidden rounded-full bg-slate-200/90">
                <div
                  className="h-full rounded-full bg-echo-brand transition-[width] duration-300"
                  style={{ width: `${s.barPct}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

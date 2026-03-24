import { useMemo, useState } from 'react'
import { useExpenseUserSlice } from '../store/expense-store'
import { CategoryProgressBars } from './category-progress-bars'
import { LimitSettingsPanel } from './limit-settings-panel'
import { SpendingDistributionCard } from './spending-distribution-card'
import {
  getFinancialHealthScore,
  getTotalExpenses,
  getTotalIncome,
  getRemainingBudget,
  isOverBudget,
} from '../utils/calculations'
import { getTopSpendingDistribution } from '../utils/spending-distribution'

const SCORE_RING_R = 38
const SCORE_C = 2 * Math.PI * SCORE_RING_R

const scoreRingStrokeColor = (score: number, overBudget: boolean) => {
  if (overBudget) return 'hsl(0, 72%, 42%)'
  const s = Math.min(100, Math.max(0, score))
  const hue = (s / 100) * 120
  return `hsl(${hue}, 72%, 42%)`
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value)

const ScoreRing = ({
  score,
  overBudget,
  sizeClass,
}: {
  score: number
  overBudget: boolean
  sizeClass: string
}) => {
  const pct = overBudget ? 0 : Math.min(100, Math.max(0, score))
  const dash = (pct / 100) * SCORE_C
  const strokeColor = scoreRingStrokeColor(score, overBudget)

  return (
    <div className={`relative shrink-0 ${sizeClass}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden>
        <circle
          cx="50"
          cy="50"
          r={SCORE_RING_R}
          fill="none"
          className="stroke-muted"
          strokeWidth="7"
        />
        {!overBudget && (
          <circle
            cx="50"
            cy="50"
            r={SCORE_RING_R}
            fill="none"
            stroke={strokeColor}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${SCORE_C}`}
          />
        )}
        {overBudget && (
          <circle
            cx="50"
            cy="50"
            r={SCORE_RING_R}
            fill="none"
            stroke={strokeColor}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${SCORE_C * 0.12} ${SCORE_C}`}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-3xl font-bold tabular-nums md:text-4xl"
          style={{ color: strokeColor }}
          aria-live="polite"
        >
          {overBudget ? '!' : score}
        </span>
      </div>
    </div>
  )
}

export const FinancialHealthCard = () => {
  const [scoreInfoOpen, setScoreInfoOpen] = useState(false)
  const { monthlyIncome, transactions } = useExpenseUserSlice()
  const totalIncome = useMemo(
    () => getTotalIncome(monthlyIncome, transactions),
    [monthlyIncome, transactions]
  )
  const totalExpenses = useMemo(
    () => getTotalExpenses(transactions),
    [transactions]
  )
  const remaining = useMemo(
    () => getRemainingBudget(monthlyIncome, transactions),
    [monthlyIncome, transactions]
  )
  const overBudget = useMemo(
    () => isOverBudget(monthlyIncome, transactions),
    [monthlyIncome, transactions]
  )
  const score = useMemo(
    () => getFinancialHealthScore(monthlyIncome, transactions),
    [monthlyIncome, transactions]
  )
  const spendingSlices = useMemo(
    () => getTopSpendingDistribution(transactions, 4),
    [transactions]
  )

  const statusLabel = overBudget
    ? 'Bütçe aşıldı'
    : totalIncome <= 0
      ? 'Gelir girerek başlayın'
      : score >= 70
        ? 'Güçlü finansal durum'
        : score >= 40
          ? 'Orta seviye'
          : 'Dikkat'

  const statusDetail =
    totalIncome <= 0
      ? 'Aylık gelir ve işlemler girildiğinde skor hesaplanır.'
      : overBudget
        ? 'Toplam giderler toplam geliri aştığında skor düşer ve bütçe uyarısı gösterilir.'
        : 'Skor, gelirinizden giderleri çıkardıktan sonra kalanın gelire oranıdır. %70 ve üzeri genelde güçlü kabul edilir.'

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-echo-brand bg-card p-8 shadow-md md:p-10"
      role="region"
      aria-label="Bütçe dashboard"
    >
      <div className="relative space-y-8">
        <div className="flex min-h-[13rem] flex-col justify-center rounded-2xl border border-echo-brand/45 bg-muted/30 p-6 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Bu Ay Kalan Bütçen
          </p>
          {totalIncome > 0 ? (
            <>
              <p
                className={`mt-2 text-4xl font-bold tabular-nums tracking-tight md:text-5xl ${remaining >= 0 ? 'text-foreground' : 'text-destructive'}`}
                aria-live="polite"
                aria-atomic="true"
              >
                {formatCurrency(remaining)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatCurrency(totalIncome)} gelir − {formatCurrency(totalExpenses)} gider
              </p>
            </>
          ) : (
            <p className="mt-2 text-lg text-muted-foreground">Gelir girerek başlayın</p>
          )}
        </div>
        <div className="flex flex-col gap-6 md:flex-row md:items-stretch md:justify-between md:gap-8">
          <div className="flex min-h-[13rem] flex-1 flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <ScoreRing
              score={score}
              overBudget={overBudget}
              sizeClass="h-24 w-24 md:h-28 md:w-28"
            />
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-foreground md:text-xl">
                Finansal Sağlık Skoru
              </h2>
              <button
                type="button"
                onClick={() => setScoreInfoOpen((o) => !o)}
                aria-expanded={scoreInfoOpen}
                className="mt-3 flex w-full max-w-lg items-start gap-2 rounded-lg border border-[0.5px] border-echo-brand/55 bg-echo-brand/[0.06] px-3 py-2.5 text-left transition hover:bg-echo-brand/[0.1] focus-visible:outline focus-visible:ring-2 focus-visible:ring-echo-brand/40"
              >
                <span className="mt-0.5 shrink-0 text-lg leading-none text-echo-brand" aria-hidden>
                  ⓘ
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Skor özeti
                  </span>
                  <span className="mt-0.5 block text-sm font-medium text-foreground">
                    {statusLabel}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Formül ve açıklama için tıklayın
                  </span>
                </span>
                <span
                  className={`shrink-0 text-echo-brand transition-transform ${scoreInfoOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                >
                  ▼
                </span>
              </button>
              {scoreInfoOpen && (
                <div
                  role="region"
                  className="mt-2 max-w-lg rounded-lg border border-echo-brand/45 bg-card px-3 py-3 text-sm shadow-sm"
                >
                  <p className="font-semibold text-foreground">Formül</p>
                  <p className="mt-1 font-medium text-foreground">(Gelir − Giderler) ÷ Gelir</p>
                  <p className="mt-3 text-muted-foreground">{statusDetail}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Durum: <span className="font-medium text-foreground">{statusLabel}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
          <SpendingDistributionCard slices={spendingSlices} />
        </div>
        <div className="space-y-4">
          <LimitSettingsPanel />
          <CategoryProgressBars />
        </div>
      </div>
    </div>
  )
}

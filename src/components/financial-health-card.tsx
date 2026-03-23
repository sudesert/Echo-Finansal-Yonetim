import { useMemo } from 'react'
import { useExpenseStore, selectCurrentUser } from '../store/expense-store'
import { CategoryProgressBars } from './category-progress-bars'
import {
  getFinancialHealthScore,
  getFutureCostRiskAnalysis,
  getTotalExpenses,
  getTotalIncome,
  getRemainingBudget,
  isOverBudget,
} from '../utils/calculations'
import type { RiskLevel } from '../utils/calculations'

const getScoreColor = (score: number, overBudget: boolean) => {
  if (overBudget) return 'from-rose-500 to-red-600'
  if (score >= 70) return 'from-emerald-400/90 to-teal-500/90'
  if (score >= 40) return 'from-amber-400/90 to-orange-500/90'
  return 'from-rose-400/90 to-red-500/90'
}

const getRiskColor = (risk: RiskLevel) => {
  switch (risk) {
    case 'low':
      return 'text-emerald-600'
    case 'medium':
      return 'text-amber-600'
    case 'high':
      return 'text-orange-600'
    case 'critical':
      return 'text-red-600'
  }
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value)

export const FinancialHealthCard = () => {
  const { monthlyIncome, transactions } = useExpenseStore(selectCurrentUser)
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
  const riskAnalysis = useMemo(
    () => getFutureCostRiskAnalysis(monthlyIncome, transactions),
    [monthlyIncome, transactions]
  )
  const scoreGradient = getScoreColor(score, overBudget)

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/40 p-8 shadow-2xl backdrop-blur-xl md:p-10"
      role="region"
      aria-label="Bütçe dashboard"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-xl" />
      <div className="relative space-y-8">
        <div className="rounded-2xl bg-white/50 p-6 text-center backdrop-blur-sm">
          <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
            Bu Ay Kalan Bütçen
          </p>
          {totalIncome > 0 ? (
            <>
              <p
                className={`mt-2 text-4xl font-bold md:text-5xl ${remaining >= 0 ? 'text-slate-800' : 'text-red-600'}`}
                aria-live="polite"
                aria-atomic="true"
              >
                {formatCurrency(remaining)}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {formatCurrency(totalIncome)} gelir − {formatCurrency(totalExpenses)} gider
              </p>
            </>
          ) : (
            <p className="mt-2 text-lg text-slate-500">Gelir girerek başlayın</p>
          )}
        </div>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div
              className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${scoreGradient} text-3xl font-bold text-white shadow-lg ring-4 ring-white/50 md:h-28 md:w-28 md:text-4xl`}
              aria-live="polite"
              aria-atomic="true"
            >
              {overBudget ? '!' : score}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800 md:text-xl">
                Finansal Sağlık Skoru
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                (Gelir − Giderler) ÷ Gelir
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {overBudget
                  ? 'Bütçe aşıldı'
                  : totalIncome <= 0
                    ? 'Gelir girerek başlayın'
                    : score >= 70
                      ? 'Güçlü finansal durum'
                      : score >= 40
                        ? 'Orta seviye'
                        : 'Dikkat'}
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-white/40 p-5 backdrop-blur-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Gelecek Maliyeti (10 yıl)
            </p>
            <p
              className="mt-1 text-2xl font-bold text-slate-800 md:text-3xl"
              aria-live="polite"
            >
              {formatCurrency(riskAnalysis.futureCost)}
            </p>
            <p className={`mt-2 text-sm font-medium ${getRiskColor(riskAnalysis.riskLevel)}`}>
              {riskAnalysis.message}
            </p>
            {totalIncome > 0 && (
              <p className="mt-1 text-xs text-slate-500">
                Gelire oranı: %{Math.round(riskAnalysis.incomeRatio * 100)}
              </p>
            )}
          </div>
        </div>
        <CategoryProgressBars />
      </div>
    </div>
  )
}

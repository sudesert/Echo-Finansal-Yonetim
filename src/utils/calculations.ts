import type { Transaction } from '../types'

const INFLATION_RATE = 0.03
const MONTHS_IN_10_YEARS = 120

export const getTotalIncome = (monthlyIncome: number, transactions: Transaction[]): number =>
  monthlyIncome + transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0)

export const getTotalExpenses = (transactions: Transaction[]): number =>
  transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0)

export const getExpensesForFutureCost = (transactions: Transaction[]) =>
  transactions.filter((t) => t.type === 'expense')

export const getMonthlyRecurring = (transactions: Transaction[]): number =>
  getExpensesForFutureCost(transactions).reduce((sum, e) => sum + (e.amount || 0), 0)

export const getRemainingBudget = (
  monthlyIncome: number,
  transactions: Transaction[]
): number =>
  getTotalIncome(monthlyIncome, transactions) - getTotalExpenses(transactions)

export const getFinancialHealthScore = (
  monthlyIncome: number,
  transactions: Transaction[]
): number => {
  const income = getTotalIncome(monthlyIncome, transactions)
  const expenses = getTotalExpenses(transactions)
  if (income <= 0) return expenses === 0 ? 100 : 0
  const ratio = (income - expenses) / income
  if (ratio < 0) return 0
  return Math.round(Math.min(100, Math.max(0, ratio * 100)))
}

export const isOverBudget = (
  monthlyIncome: number,
  transactions: Transaction[]
): boolean => getTotalExpenses(transactions) > getTotalIncome(monthlyIncome, transactions)

export const getFutureCostIn10Years = (transactions: Transaction[]): number => {
  const expenses = getExpensesForFutureCost(transactions)
  const recurring = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
  const total = recurring * MONTHS_IN_10_YEARS
  return Math.round(total * Math.pow(1 + INFLATION_RATE, 10))
}

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export const getFutureCostRiskAnalysis = (
  monthlyIncome: number,
  transactions: Transaction[]
): { futureCost: number; riskLevel: RiskLevel; incomeRatio: number; message: string } => {
  const income = getTotalIncome(monthlyIncome, transactions)
  const futureCost = getFutureCostIn10Years(transactions)
  const totalIncome10Years = income * MONTHS_IN_10_YEARS

  if (income <= 0) {
    return {
      futureCost,
      riskLevel: 'critical',
      incomeRatio: 0,
      message: 'Gelir girilmedi — risk analizi yapılamıyor',
    }
  }

  const incomeRatio = totalIncome10Years > 0 ? futureCost / totalIncome10Years : 0

  let riskLevel: RiskLevel = 'low'
  let message: string

  if (incomeRatio <= 0.5) {
    riskLevel = 'low'
    message = 'Düşük risk — gelecek maliyeti gelirin yarısından az'
  } else if (incomeRatio <= 1) {
    riskLevel = 'medium'
    message = 'Orta risk — gelecek maliyeti gelire yakın'
  } else if (incomeRatio <= 1.5) {
    riskLevel = 'high'
    message = 'Yüksek risk — gelecek maliyeti geliri aşıyor'
  } else {
    riskLevel = 'critical'
    message = 'Kritik risk — harcamaları gözden geçirin'
  }

  return { futureCost, riskLevel, incomeRatio, message }
}

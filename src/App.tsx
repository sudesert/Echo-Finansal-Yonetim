import { useDataInit } from './hooks/use-data-init'
import { IncomeCard } from './components/income-card'
import { FinancialHealthCard } from './components/financial-health-card'
import { TransactionInputCard } from './components/transaction-input-card'
import { TransactionsTable } from './components/transactions-table'
import { UserQrCard } from './components/user-qr-card'
import { LimitSettingsPanel } from './components/limit-settings-panel'

function App() {
  useDataInit()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Echo</h1>
          <p className="text-slate-600">Finansal Yönetim</p>
        </header>
        <div className="space-y-8">
          <IncomeCard />
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-start">
            <FinancialHealthCard />
            <UserQrCard />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-800">Harcama Ekle</h2>
              <LimitSettingsPanel />
            </div>
            <TransactionInputCard />
          </div>
          <TransactionsTable />
        </div>
      </div>
    </div>
  )
}

export default App

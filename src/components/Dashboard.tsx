import { useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { EchoLogo } from './echo-logo'
import { FinancialHealthCard } from './financial-health-card'
import { MonthlyIncomeField } from './income-card'
import { TransactionInputCard } from './transaction-input-card'
import { TransactionsTable } from './transactions-table'
import { UserQrCard } from './user-qr-card'
import { useExpenseStore } from '../store/expense-store'
import { formatPhoneDisplay } from '../utils/phone'

export const Dashboard = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [hideSessionPhoneDisplay, setHideSessionPhoneDisplay] = useState(false)
  const sessionPhone = useExpenseStore((s) => s.sessionPhone)
  const loadPhoneData = useExpenseStore((s) => s.loadPhoneData)
  const phoneDisplay =
    hideSessionPhoneDisplay && phoneNumber.length === 0
      ? ''
      : phoneNumber.length > 0 || !sessionPhone
        ? phoneNumber
        : formatPhoneDisplay(sessionPhone)
  const handleLoadSession = () => {
    const raw = phoneNumber.trim() || sessionPhone || ''
    if (!raw) return
    const ok = loadPhoneData(raw)
    if (ok) setHideSessionPhoneDisplay(false)
  }
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    setHideSessionPhoneDisplay(false)
    setPhoneNumber(formatPhoneDisplay(e.target.value))
  }
  const handlePhoneKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleLoadSession()
    }
  }
  const handleClearPhone = () => {
    setPhoneNumber('')
    setHideSessionPhoneDisplay(true)
  }
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <div
        className="mb-6 rounded-lg border border-dashed border-echo-brand bg-muted/30 px-4 py-3 text-center text-sm text-muted-foreground"
        role="status"
      >
        Sayfayı yenilediğinizde (F5) ekran sıfırlanır; kayıtlarınız cihazda durur, tekrar yüklemek
        için numarayı yazıp &quot;Verileri Getir&quot;e basın. Üstteki Ana sayfa / Tablo bağlantıları
        sayfayı yenilemeden geçer; bu geçişte veriler silinmez.
      </div>
      <header className="mb-8 border-b border-echo-brand pb-6 text-center">
        <EchoLogo className="mx-auto" />
        <p className="mt-3 text-center font-serif text-base italic leading-relaxed text-foreground md:text-lg">
          - Finansal Takip -
        </p>
      </header>
      <div className="space-y-8">
        <div
          className="rounded-2xl border border-echo-brand bg-card p-5 shadow-md md:p-6"
          role="region"
          aria-label="Telefon (basit)"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <label
              htmlFor="echo-simple-phone"
              className="shrink-0 font-sans text-sm font-medium text-foreground"
            >
              Telefon Numarası
            </label>
            <p
              className="max-w-md rounded-md border border-echo-brand/50 bg-echo-brand/[0.06] px-2.5 py-1.5 font-sans text-[11px] leading-snug text-muted-foreground"
              role="note"
            >
              <span className="mr-1 text-echo-brand" aria-hidden>
                ⓘ
              </span>
              Bu numara, bu cihazda saklanan eski kayıtlarınızın geri yüklenmesi ve aynı verilerle devam
              edebilmeniz içindir.
            </p>
          </div>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end">
            <input
              id="echo-simple-phone"
              type="tel"
              name="phoneNumber"
              inputMode="numeric"
              autoComplete="tel"
              value={phoneDisplay}
              onChange={handlePhoneChange}
              onKeyDown={handlePhoneKeyDown}
              placeholder="05xx xxx xx xx"
              className="min-w-0 flex-1 rounded-lg border-2 border-echo-brand/35 bg-background px-3 py-3 font-mono text-sm tabular-nums text-foreground focus:border-echo-brand focus:outline-none focus:ring-2 focus:ring-echo-brand/40"
            />
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={handleLoadSession}
                className="rounded-lg border-2 border-echo-brand bg-transparent px-5 py-2.5 font-sans text-sm font-medium text-foreground transition hover:bg-echo-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-echo-brand/45"
              >
                Verileri Getir
              </button>
              <button
                type="button"
                onClick={handleClearPhone}
                className="rounded-lg border-2 border-echo-brand/50 bg-transparent px-4 py-2.5 font-sans text-sm font-medium text-muted-foreground transition hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-echo-brand/35"
                aria-label="Numarayı alandan sil"
              >
                Numarayı sil
              </button>
            </div>
          </div>
          <div className="mt-5 border-t border-echo-brand/30 pt-5">
            <MonthlyIncomeField />
          </div>
        </div>
        <FinancialHealthCard />
        <TransactionInputCard />
        <UserQrCard />
        <TransactionsTable />
      </div>
    </div>
  )
}
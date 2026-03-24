import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useExpenseStore } from '../store/expense-store'
import {
  digitsOnly,
  formatPhoneDisplay,
  isPhoneLikeUserId,
  isValidTurkishMobile,
  normalizePhoneKey,
} from '../utils/phone'

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
)

const formatSessionLabel = (phone: string) => {
  if (phone.includes('@')) return phone
  if (isPhoneLikeUserId(phone)) return formatPhoneDisplay(phone)
  return phone
}

export const UserSessionCard = () => {
  const sessionPhone = useExpenseStore((s) => s.sessionPhone)
  const loadPhoneData = useExpenseStore((s) => s.loadPhoneData)
  const clearSession = useExpenseStore((s) => s.clearSession)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [error, setError] = useState('')
  const [switching, setSwitching] = useState(false)

  const hasSession = sessionPhone !== null

  const runFetch = () => {
    setError('')
    const key = normalizePhoneKey(phoneNumber)
    if (!isValidTurkishMobile(key)) {
      setError('Geçerli bir cep telefonu numarası girin (05xx xxx xx xx)')
      return
    }
    const ok = loadPhoneData(phoneNumber)
    if (!ok) {
      setError('Numara yüklenemedi')
      return
    }
    setPhoneNumber('')
    setSwitching(false)
  }

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = formatPhoneDisplay(e.target.value)
    setPhoneNumber(next)
    setError('')
    if (digitsOnly(next).length === 0) {
      clearSession()
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    runFetch()
  }

  return (
    <div
      className="rounded-2xl border border-echo-brand bg-card p-5 shadow-md md:p-6"
      role="region"
      aria-label="Telefon ile oturum"
    >
      {hasSession && !switching && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-sans text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Oturum
            </p>
            <p className="mt-1 font-mono text-sm font-medium text-foreground">
              {sessionPhone ? formatSessionLabel(sessionPhone) : ''}
            </p>
            <p className="mt-1 font-sans text-xs text-muted-foreground">
              Veriler bu cihazda bu numaraya bağlı saklanır.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSwitching(true)
              setPhoneNumber('')
              setError('')
            }}
            className="shrink-0 rounded-md border border-echo-brand/45 bg-muted/40 px-3 py-2 font-sans text-sm font-medium text-foreground transition hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-echo-brand/40"
          >
            Numara değiştir
          </button>
        </div>
      )}

      {(!hasSession || switching) && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="echo-session-phone" className="font-sans text-sm font-medium text-foreground">
              Telefon numarası
            </label>
            <div className="relative mt-2">
              <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="echo-session-phone"
                type="tel"
                name="phone"
                inputMode="numeric"
                autoComplete="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="05xx xxx xx xx"
                className="w-full rounded-lg border-2 border-echo-brand/35 bg-background py-3 pl-10 pr-3 font-mono text-sm tabular-nums tracking-tight text-foreground shadow-sm placeholder:text-muted-foreground/70 focus:border-echo-brand focus:outline-none focus:ring-2 focus:ring-echo-brand/40"
                aria-invalid={!!error}
                aria-describedby={error ? 'echo-session-phone-error' : 'echo-session-phone-hint'}
              />
            </div>
            <p id="echo-session-phone-hint" className="mt-2 font-sans text-xs text-muted-foreground">
              Verilerinize erişmek için numaranızı giriniz.
            </p>
            {error && (
              <p id="echo-session-phone-error" className="mt-1.5 font-sans text-xs text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              className="rounded-lg border-2 border-echo-brand bg-transparent px-5 py-2.5 font-sans text-sm font-medium text-foreground transition hover:bg-echo-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-echo-brand/45"
            >
              Verileri Getir
            </button>
            {switching && (
              <button
                type="button"
                onClick={() => {
                  setSwitching(false)
                  setPhoneNumber('')
                  setError('')
                }}
                className="rounded-md border border-echo-brand/45 px-4 py-2 font-sans text-sm font-medium text-muted-foreground hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-echo-brand/40"
              >
                İptal
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  )
}

import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { Transaction } from './types'
import { useExpenseStore } from './store/expense-store'
import { getRemainingBudget, getTotalExpenses, getTotalIncome } from './utils/calculations'
import { decodeExportPayload } from './utils/payload-codec'
import { getEncodedExportFromLocation } from './utils/share-url'
import { sortTransactionsChronological } from './utils/sort-transactions'

const monoTabular = 'font-mono tabular-nums tracking-tight'

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

const formatTry = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

const formatRowAmountAbs = (t: Transaction) => formatTry(Math.abs(t.amount || 0))

const ViewData = () => {
  const location = useLocation()
  const encodedParam = useMemo(
    () => getEncodedExportFromLocation(location.search, location.hash),
    [location.search, location.hash],
  )
  const sessionPhone = useExpenseStore((s) => s.sessionPhone)
  const exportData = useExpenseStore((s) => s.exportData)
  const monthlyIncome = useExpenseStore((s) => s.monthlyIncome)
  const transactions = useExpenseStore((s) => s.transactions)
  const categoryLimits = useExpenseStore((s) => s.categoryLimits)

  const data = useMemo(() => {
    if (encodedParam) return decodeExportPayload(encodedParam)
    if (sessionPhone) return exportData()
    return null
  }, [encodedParam, sessionPhone, exportData, monthlyIncome, transactions, categoryLimits])

  const rows = useMemo(() => {
    if (!data) return []
    return sortTransactionsChronological(data.transactions)
  }, [data])

  const summary = useMemo(() => {
    if (!data) return null
    const { monthlyIncome, transactions } = data
    const totalIn = getTotalIncome(monthlyIncome, transactions)
    const totalOut = getTotalExpenses(transactions)
    const remaining = getRemainingBudget(monthlyIncome, transactions)
    return { monthlyIncome, totalIn, totalOut, remaining }
  }, [data])

  const handleSavePdf = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-background print:bg-white">
      <div className="mx-auto max-w-6xl px-3 py-6 md:px-6 md:py-8">
        <div className="mb-4 hidden print:block">
          <p className="text-sm font-semibold text-foreground">Echo — Tablo</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {rows.length} satır · {new Intl.DateTimeFormat('tr-TR').format(new Date())}
          </p>
        </div>

        {!data && (
          <div className="space-y-3">
            {encodedParam ? (
              <div
                className="rounded-md border border-echo-brand bg-card px-4 py-3 text-sm text-foreground"
                role="alert"
              >
                Bağlantıdaki <code className="rounded bg-muted px-1 text-sm font-medium">data</code> /{' '}
                <code className="rounded bg-muted px-1 text-sm font-medium">payload</code> okunamadı. QR&apos;ı
                yeniden oluşturun veya geçerli paylaşım bağlantısını kullanın.
              </div>
            ) : (
              <div
                className="rounded-md border border-echo-brand bg-card px-4 py-3 text-sm text-foreground"
                role="status"
              >
                Görüntülenecek oturum yok.{' '}
                <Link
                  to="/"
                  className="font-medium text-echo-brand underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-echo-brand/40"
                >
                  Ana sayfa
                </Link>
                ’dan telefon numaranızı yazıp &quot;Verileri Getir&quot; ile kayıtlarınızı yükleyin; bu sayfa QR ile aynı
                paylaşım tablosunu gösterir.
              </div>
            )}
          </div>
        )}

        {data && summary && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 print:hidden sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-semibold text-foreground md:text-2xl">Tablo</h1>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {encodedParam
                    ? 'Paylaşım (salt okunur, telefon gerekmez)'
                    : 'Oturum verisi (salt okunur)'}
                  {' · '}
                  {rows.length} satır
                </p>
              </div>
              <button
                type="button"
                onClick={handleSavePdf}
                className="inline-flex w-fit items-center justify-center rounded-md border border-[0.5px] border-echo-brand bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-echo-brand/40"
              >
                PDF olarak kaydet
              </button>
            </div>

            <div className="overflow-hidden rounded-md border border-echo-brand bg-card shadow-sm print:border print:shadow-none">
              <div className="border-b border-echo-brand/35 bg-muted/50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground print:hidden">
                Veri — {rows.length} satır
              </div>
              <div className="overflow-x-auto">
                <table
                  className="w-full min-w-[720px] border-collapse text-left text-[13px] leading-tight text-foreground"
                  aria-label="İşlemler tablosu"
                >
                  <thead>
                    <tr className="bg-foreground text-background print:bg-foreground">
                      <th
                        scope="col"
                        className={`w-10 border border-background/20 px-1.5 py-2 text-center text-[11px] font-semibold ${monoTabular}`}
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className={`border border-background/20 px-2 py-2 text-[11px] font-semibold ${monoTabular}`}
                      >
                        Tarih
                      </th>
                      <th
                        scope="col"
                        className="border border-background/20 px-2 py-2 text-[11px] font-semibold"
                      >
                        Tür
                      </th>
                      <th
                        scope="col"
                        className="border border-background/20 px-2 py-2 text-[11px] font-semibold"
                      >
                        Kategori
                      </th>
                      <th
                        scope="col"
                        className="border border-background/20 px-2 py-2 text-[11px] font-semibold"
                      >
                        Açıklama
                      </th>
                      <th
                        scope="col"
                        className={`border border-background/20 px-2 py-2 text-right text-[11px] font-semibold ${monoTabular}`}
                      >
                        Tutar (₺)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="border border-echo-brand/35 bg-card px-3 py-8 text-center text-muted-foreground"
                        >
                          Bu paylaşımda işlem yok.
                        </td>
                      </tr>
                    )}
                    {rows.map((row, index) => {
                      const zebra = index % 2 === 0 ? 'bg-card' : 'bg-muted/30'
                      return (
                        <tr key={row.id || `r-${index}`} className={zebra}>
                          <td
                            className={`border border-echo-brand/35 px-1.5 py-1.5 text-center text-muted-foreground ${monoTabular}`}
                          >
                            {index + 1}
                          </td>
                          <td
                            className={`whitespace-nowrap border border-echo-brand/35 px-2 py-1.5 text-foreground ${monoTabular}`}
                          >
                            {formatDate(row.date)}
                          </td>
                          <td className="border border-echo-brand/35 px-2 py-1.5">
                            <span
                              className={
                                row.type === 'income'
                                  ? 'rounded px-1.5 py-0.5 text-[11px] font-medium text-emerald-800 bg-emerald-100'
                                  : 'rounded px-1.5 py-0.5 text-[11px] font-medium text-red-800 bg-red-100'
                              }
                            >
                              {row.type === 'income' ? 'Gelir' : 'Gider'}
                            </span>
                          </td>
                          <td className="border border-echo-brand/35 px-2 py-1.5">
                            {row.category?.trim() || '—'}
                          </td>
                          <td className="max-w-md border border-echo-brand/35 px-2 py-1.5">
                            {row.description?.trim() || '—'}
                          </td>
                          <td
                            className={`whitespace-nowrap border border-echo-brand/35 px-2 py-1.5 text-right font-medium ${monoTabular} ${
                              row.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                            }`}
                          >
                            {row.type === 'income' ? '+' : '−'}
                            {formatRowAmountAbs(row)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  {rows.length > 0 && summary && (
                    <tfoot>
                      <tr className="bg-muted/50 font-semibold">
                        <td
                          colSpan={5}
                          className="border border-echo-brand/35 px-2 py-2 text-right text-[12px] text-muted-foreground"
                        >
                          Net (gelir − gider)
                        </td>
                        <td
                          className={`border border-echo-brand/35 px-2 py-2 text-right text-[12px] ${monoTabular} ${
                            summary.remaining < 0 ? 'text-red-600' : 'text-emerald-600'
                          }`}
                        >
                          {summary.remaining < 0 ? '−' : '+'}
                          {formatTry(Math.abs(summary.remaining))}
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewData

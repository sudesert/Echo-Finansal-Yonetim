import { useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useExpenseStore, selectCurrentUser } from '../store/expense-store'

export const UserQrCard = () => {
  const { monthlyIncome, transactions } = useExpenseStore(selectCurrentUser)
  const exportData = useExpenseStore((s) => s.exportData)

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    const data = exportData()
    const json = JSON.stringify(data)
    const base64 = btoa(unescape(encodeURIComponent(json)))
    const url = new URL(window.location.origin + window.location.pathname)
    url.searchParams.set('data', base64)
    return url.toString()
  }, [exportData, monthlyIncome, transactions])

  return (
    <div
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/30"
      role="region"
      aria-label="Veri paylaşım QR kodu"
    >
      <h3 className="text-sm font-semibold text-slate-700">Verilerini Paylaş</h3>
      <p className="mt-1 text-xs text-slate-500">
        QR kodu tara, bütçeni başka cihazda gör
      </p>
      <div className="mt-4 flex flex-col items-center gap-3">
        <div className="rounded-xl bg-white p-3 ring-2 ring-slate-100">
          <QRCodeSVG value={shareUrl} size={160} level="M" />
        </div>
      </div>
    </div>
  )
}

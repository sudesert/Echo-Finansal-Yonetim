import { useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useExpenseStore, useExpenseUserSlice } from '../store/expense-store'
import { encodeExportPayload } from '../utils/payload-codec'
import { buildViewDataUrl, needsLanQrHint } from '../utils/share-url'

/** QR: /view-data?data=… — tam dışa aktarım (gelir + işlemler + limitler), UTF-8 güvenli kodlama */
import { QR_ECHO_ICON_DATA_URI } from './qr-echo-icon'

const QR_SIZE = 240
const LOGO_PX = 56

export const UserQrCard = () => {
  const { monthlyIncome, transactions, categoryLimits } = useExpenseUserSlice()
  const exportData = useExpenseStore((s) => s.exportData)

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    const snapshot = exportData()
    const encodedData = encodeExportPayload(snapshot)
    return buildViewDataUrl(encodedData)
  // eslint-disable-next-line react-hooks/exhaustive-deps -- exportData ref is stable; slice deps refresh QR when store changes
  }, [exportData, monthlyIncome, transactions, categoryLimits])

  const showLanHint = typeof window !== 'undefined' && needsLanQrHint()

  return (
    <div
      className="rounded-xl border border-echo-brand/80 bg-card p-4 shadow-sm"
      role="region"
      aria-label="QR ile tablo paylaşımı"
    >
      <h3 className="text-center text-sm font-medium text-foreground">Paylaş</h3>
      <p className="mt-0.5 text-center text-xs text-muted-foreground">
        Mobilde okutun; masaüstünde Verileri İncele ile aynı tablo açılır.
      </p>

      <div className="mt-4 flex flex-col items-center">
        <div className="rounded-xl border border-echo-brand/15 bg-white p-3">
          {shareUrl ? (
            <QRCodeSVG
              key={shareUrl}
              value={shareUrl}
              size={QR_SIZE}
              level="H"
              boostLevel
              marginSize={4}
              fgColor="#000000"
              bgColor="#FFFFFF"
              imageSettings={{
                src: QR_ECHO_ICON_DATA_URI,
                height: LOGO_PX,
                width: LOGO_PX,
                excavate: true,
              }}
              role="presentation"
              focusable="false"
            />
          ) : (
            <div
              className="flex items-center justify-center font-sans text-xs text-muted-foreground"
              style={{ width: QR_SIZE, height: QR_SIZE }}
            >
              …
            </div>
          )}
        </div>

        {shareUrl && (
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-w-[10rem] items-center justify-center rounded-lg border border-echo-brand bg-transparent px-5 py-2 font-sans text-sm font-medium text-foreground transition hover:bg-echo-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-echo-brand/40"
          >
            Verileri İncele
          </a>
        )}

        {showLanHint && (
          <p className="mt-4 max-w-sm text-center text-[10px] leading-relaxed text-muted-foreground">
            Telefonda denemek için uygulamayı aynı Wi‑Fi IP adresiyle açın veya{' '}
            <code className="rounded bg-muted px-1 font-mono text-[9px]">VITE_QR_BASE_URL</code> tanımlayın.
          </p>
        )}
      </div>
    </div>
  )
}

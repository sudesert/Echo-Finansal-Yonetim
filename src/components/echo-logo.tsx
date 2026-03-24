import { useId, useMemo } from 'react'

const BRAND = '#732B1A'

type EchoLogoProps = {
  className?: string
  size?: 'md' | 'lg'
}

const BAR_HEIGHTS = [18, 20, 19, 24, 26, 28, 32, 30, 36, 38, 42, 44, 48, 52]
const BAR_W = 14
const GAP = 8
const X0 = 22
const Y_BASE = 100

export const EchoLogo = ({ className = '', size = 'lg' }: EchoLogoProps) => {
  const rawId = useId()
  const uid = rawId.replace(/:/g, '')

  const linePath = useMemo(() => {
    const pts = BAR_HEIGHTS.map((h, i) => {
      const x = X0 + i * (BAR_W + GAP) + BAR_W / 2
      const y = Y_BASE - h
      return { x, y }
    })
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  }, [])

  const isLg = size === 'lg'
  const wrapClass = isLg
    ? 'min-h-[8.5rem] w-full max-w-[28rem] md:min-h-[9.5rem] md:max-w-[32rem]'
    : 'min-h-[7rem] w-full max-w-[20rem] md:min-h-[7.5rem]'

  const textClass = isLg
    ? 'text-7xl md:text-8xl lg:text-9xl'
    : 'text-6xl md:text-7xl'

  return (
    <div
      className={`relative overflow-visible rounded-2xl border border-echo-brand ${wrapClass} ${className}`}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.42]"
        viewBox="0 0 400 120"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id={`${uid}-bar`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={BRAND} stopOpacity="0.08" />
            <stop offset="100%" stopColor={BRAND} stopOpacity="0.26" />
          </linearGradient>
          <filter id={`${uid}-soft`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id={`${uid}-lineSoft`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="g" />
            <feMerge>
              <feMergeNode in="g" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker
            id={`${uid}-arrow`}
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,6 L9,3 z" fill={BRAND} fillOpacity="0.45" />
          </marker>
        </defs>
        <g opacity="0.22" stroke="rgba(115,43,26,0.22)" strokeWidth="0.45">
          {Array.from({ length: 7 }, (_, i) => (
            <line key={`h-${i}`} x1="12" y1={20 + i * 14} x2="388" y2={20 + i * 14} />
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`v-${i}`} x1={20 + i * 32} y1="14" x2={20 + i * 32} y2="108" />
          ))}
        </g>

        {BAR_HEIGHTS.map((h, i) => {
          const x = X0 + i * (BAR_W + GAP)
          const y = Y_BASE - h
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={BAR_W}
              height={h}
              rx={4}
              fill={`url(#${uid}-bar)`}
              stroke={BRAND}
              strokeOpacity="0.22"
              strokeWidth="0.5"
              filter={`url(#${uid}-soft)`}
            />
          )
        })}

        <path
          d={linePath}
          fill="none"
          stroke={BRAND}
          strokeOpacity="0.42"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd={`url(#${uid}-arrow)`}
          filter={`url(#${uid}-lineSoft)`}
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4">
        <span
          className={`font-bold uppercase tracking-[0.06em] antialiased [text-shadow:0_1px_0_rgba(255,255,255,0.88),0_2px_14px_rgba(115,43,26,0.2)] ${textClass}`}
          style={{
            color: BRAND,
            fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif',
          }}
        >
          ECHO
        </span>
      </div>
    </div>
  )
}

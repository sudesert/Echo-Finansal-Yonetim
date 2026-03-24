type CategoryMiniIconProps = {
  category: string
  className?: string
}

const stroke = 'currentColor'

export const CategoryMiniIcon = ({ category, className = '' }: CategoryMiniIconProps) => {
  const base = `h-4 w-4 shrink-0 ${className}`
  const n = category.trim()

  if (n === 'Market' || n === 'Gıda') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 10h14v10a1 1 0 01-1 1H6a1 1 0 01-1-1V10zm2-4h10l2 4H5l2-4z"
          stroke={stroke}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (n === 'Ulaşım') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 14h16v2H4v-2zm1-4l1.5-3h13L20 10H5z"
          stroke={stroke}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="7.5" cy="16.5" r="1.25" stroke={stroke} strokeWidth="1.25" />
        <circle cx="16.5" cy="16.5" r="1.25" stroke={stroke} strokeWidth="1.25" />
      </svg>
    )
  }
  if (n === 'Eğlence') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z"
          stroke={stroke}
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
  if (n === 'Diğer') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="6" cy="12" r="1.5" fill={stroke} />
        <circle cx="12" cy="12" r="1.5" fill={stroke} />
        <circle cx="18" cy="12" r="1.5" fill={stroke} />
      </svg>
    )
  }
  return (
    <svg className={base} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v18M5 8h14M5 16h14"
        stroke={stroke}
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  )
}

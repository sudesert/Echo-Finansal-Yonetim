export const digitsOnly = (s: string) => s.replace(/\D/g, '')

export const normalizePhoneKey = (raw: string): string => {
  let d = digitsOnly(raw).slice(0, 11)
  if (d.length === 10 && d.startsWith('5')) d = `0${d}`
  return d
}

export const isValidTurkishMobile = (raw: string): boolean => {
  const d = normalizePhoneKey(raw)
  return d.length === 11 && /^0[5][0-9]{9}$/.test(d)
}

export const formatPhoneDisplay = (raw: string): string => {
  const d = digitsOnly(raw).slice(0, 11)
  if (d.length === 0) return ''
  const parts: string[] = []
  parts.push(d.slice(0, Math.min(4, d.length)))
  if (d.length > 4) parts.push(d.slice(4, Math.min(7, d.length)))
  if (d.length > 7) parts.push(d.slice(7, Math.min(9, d.length)))
  if (d.length > 9) parts.push(d.slice(9, 11))
  return parts.join(' ')
}

export const isPhoneLikeUserId = (id: string): boolean => /^0[5][0-9]{9}$/.test(id)

import type { Transaction } from '../types'

export const getCategorySpending = (
  transactions: Transaction[],
  category: string
): number =>
  transactions
    .filter((t) => t.type === 'expense' && (t.category || 'Diğer') === category)
    .reduce((sum, t) => sum + t.amount, 0)

export const getCategoryStatus = (
  spent: number,
  limit: number
): 'ok' | 'warning' | 'over' => {
  if (limit <= 0) return 'ok'
  if (spent >= limit) return 'over'
  if (spent >= limit * 0.9) return 'warning'
  return 'ok'
}

export const getMotivationMessage = (
  category: string,
  status: 'warning' | 'over'
): string => {
  const messages: Record<string, { over: string; warning: string }> = {
    Kozmetik: {
      over: 'Bu kozmetik harcaması aylık limitini aşıyor! 10 yıl sonraki finansal özgürlüğün için bu harcamayı ertelemeye ne dersin? 🌱',
      warning: 'Kozmetik limitine yaklaşıyorsun. Gerçekten ihtiyacın var mı? 🌸',
    },
    Market: {
      over: 'Market limitini aştın! Alışveriş listeni gözden geçir, ihtiyaç dışı ürünleri çıkar. 🛒',
      warning: 'Market limitinin sınırındasın, sepetindeki ihtiyaçları tekrar gözden geçirmek ister misin? 🧐',
    },
    Eğlence: {
      over: 'Eğlence bütçeni aştın! Biraz tasarruf, uzun vadede büyük kazanç. 🎯',
      warning: 'Eğlence limitine yaklaşıyorsun. Bu harcama gerçekten değer mi? 🎬',
    },
  }
  const cat = messages[category] ?? {
    over: `${category} limitini aştın. Bütçeni korumak için bu harcamayı erteleyebilirsin. 💪`,
    warning: `${category} limitinin sınırındasın. Tekrar düşün! 🤔`,
  }
  return status === 'over' ? cat.over : cat.warning
}

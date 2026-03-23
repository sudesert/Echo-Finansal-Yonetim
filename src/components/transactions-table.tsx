import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { useExpenseStore, selectCurrentUser } from '../store/expense-store'
import { getCategorySpending, getCategoryStatus } from '../utils/category-limits'
import type { Transaction } from '../types'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0,
  }).format(value)

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

export const TransactionsTable = () => {
  const { transactions, categoryLimits } = useExpenseStore(selectCurrentUser)
  const removeTransaction = useExpenseStore((s) => s.removeTransaction)
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }])
  const [globalFilter, setGlobalFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState<'income' | 'expense' | ''>('')

  const overLimitCategories = useMemo(() => {
    const set = new Set<string>()
    Object.keys(categoryLimits).forEach((cat) => {
      const limit = categoryLimits[cat] ?? 0
      if (limit <= 0) return
      const spent = getCategorySpending(transactions, cat)
      if (getCategoryStatus(spent, limit) === 'over') set.add(cat)
    })
    return set
  }, [transactions, categoryLimits])

  const columns: ColumnDef<Transaction>[] = useMemo(
    () => [
      {
        accessorKey: 'date',
        header: 'Tarih',
        cell: ({ getValue }) => formatDate(getValue() as string),
        sortingFn: (a, b) =>
          new Date(a.original.date).getTime() - new Date(b.original.date).getTime(),
        enableSorting: true,
      },
      {
        accessorKey: 'description',
        header: 'Açıklama',
        cell: ({ getValue }) => getValue() || '—',
        enableSorting: true,
      },
      {
        accessorKey: 'category',
        header: 'Kategori',
        cell: ({ getValue, row }) => {
          const cat = (getValue() as string) || '—'
          const isOverLimit =
            row.original.type === 'expense' &&
            overLimitCategories.has(row.original.category || 'Diğer')
          return (
            <span className="inline-flex items-center gap-1.5">
              {isOverLimit && (
                <span title="Limit aşıldı" aria-label="Limit aşıldı">
                  ⚠️
                </span>
              )}
              {cat}
            </span>
          )
        },
        enableSorting: true,
      },
      {
        accessorKey: 'type',
        header: 'Tür',
        enableSorting: true,
        cell: ({ getValue }) => {
          const t = getValue() as string
          return (
            <span
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                t === 'income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}
            >
              {t === 'income' ? 'Gelir' : 'Harcama'}
            </span>
          )
        },
      },
      {
        accessorKey: 'amount',
        header: 'Tutar',
        enableSorting: true,
        cell: ({ row }) => {
          const amount = row.original.amount
          const isIncome = row.original.type === 'income'
          return (
            <span
              className={`font-semibold ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}
            >
              {isIncome ? '+' : '−'}{formatCurrency(amount)}
            </span>
          )
        },
      },
      {
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => removeTransaction(row.original.id)}
            aria-label="Sil"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
          </button>
        ),
      },
    ],
    [removeTransaction, overLimitCategories]
  )

  const filteredData = useMemo(() => {
    let result = transactions
    if (typeFilter) {
      result = result.filter((t) => t.type === typeFilter)
    }
    return result
  }, [transactions, typeFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
  })

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
        <p className="text-sm text-slate-500">Henüz gelir veya harcama eklenmedi</p>
        <p className="mt-1 text-xs text-slate-400">Yukarıdaki karttan ilk kaydınızı ekleyin</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Tüm İşlemler</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Ara..."
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
          <select
            value={typeFilter || 'all'}
            onChange={(e) =>
              setTypeFilter(
                e.target.value === 'all' ? '' : (e.target.value as 'income' | 'expense')
              )
            }
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-300 focus:outline-none"
          >
            <option value="all">Tümü</option>
            <option value="income">Gelir</option>
            <option value="expense">Harcama</option>
          </select>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-slate-200 bg-slate-50/80">
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                    >
                      {h.column.getCanSort() ? (
                        <button
                          type="button"
                          onClick={h.column.getToggleSortingHandler()}
                          className="flex items-center gap-1 hover:text-slate-700"
                        >
                          {flexRender(h.column.columnDef.header, h.getContext())}
                          {{
                            asc: ' ↑',
                            desc: ' ↓',
                          }[h.column.getIsSorted() as string] ?? ''}
                        </button>
                      ) : (
                        flexRender(h.column.columnDef.header, h.getContext())
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-slate-50/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

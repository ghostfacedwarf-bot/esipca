'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function SortDropdown() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || 'default'

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value
    const params = new URLSearchParams(searchParams)

    if (sort === 'default') {
      params.delete('sort')
    } else {
      params.set('sort', sort)
    }

    // Reset to page 1 when changing sort
    params.set('page', '1')

    router.push(`/produse?${params.toString()}`)
  }

  return (
    <select
      value={currentSort}
      onChange={handleSortChange}
      className="px-4 py-2 border border-dark-200 rounded-lg text-dark-700 text-sm focus:outline-none focus:border-primary-500 cursor-pointer"
    >
      <option value="default">Recomandare</option>
      <option value="price-asc">Preț (crescător)</option>
      <option value="price-desc">Preț (descrescător)</option>
      <option value="newest">Cel mai nou</option>
      <option value="bestseller">Cele mai vândute</option>
    </select>
  )
}

import Link from 'next/link'
import { Filter } from 'lucide-react'
import { Suspense } from 'react'
import { getAllProducts, getCategories as fetchCategories } from '@/lib/db'
import SortDropdown from './SortDropdown'
import ProductCard from './ProductCard'

// Mark as dynamic - fetch products at runtime, not build time
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Produse | Esipca Metalica',
  description: 'Catalog complet de șipcă metalică, tablă zincată și jgheaburi. Preturi competitive și livrare rapidă.',
}

async function getCategories() {
  return await fetchCategories()
}

async function getProducts(categoryId?: string, page: number = 1, sort: string = 'default') {
  let products = await getAllProducts()

  // Filter by category if specified
  if (categoryId) {
    products = products.filter((p: any) => p.categoryId === categoryId)
  }

  // Sort products
  if (sort === 'price-asc') {
    products.sort((a: any, b: any) => a.priceFrom - b.priceFrom)
  } else if (sort === 'price-desc') {
    products.sort((a: any, b: any) => b.priceFrom - a.priceFrom)
  } else if (sort === 'bestseller') {
    products.sort((a: any, b: any) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0))
  }

  const itemsPerPage = 9
  const skip = (page - 1) * itemsPerPage
  const totalCount = products.length
  const paginatedProducts = products.slice(skip, skip + itemsPerPage)

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return { products: paginatedProducts, totalCount, totalPages, currentPage: page }
}

export default async function ProdusePage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; page?: string; sort?: string }>
}) {
  const params = await searchParams
  const categories = await getCategories()
  const currentPage = parseInt(params.page || '1', 10)
  const { products, totalCount, totalPages } = await getProducts(params.cat, currentPage, params.sort)

  return (
    <main>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container-max">
          <h1 className="text-4xl font-bold mb-2">Catalog Produse</h1>
          <p className="text-primary-100">
            Explorează colecția completă de produse metalice de calitate
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="container-max py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg border border-dark-100 sticky top-24">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Filter size={20} />
                Filtre
              </h2>

              {/* Category filter */}
              <div>
                <h3 className="font-semibold text-dark-900 mb-3">Categorii</h3>
                <ul className="space-y-2">
                  {categories
                    .filter((category) => category.name === 'Șipcă Metalică')
                    .map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/produse?cat=${category.id}`}
                          className={`block py-2 px-3 rounded-lg transition-colors ${
                            params.cat === category.id
                              ? 'bg-primary-50 text-primary-600 font-semibold'
                              : 'text-dark-600 hover:bg-dark-50'
                          }`}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Stock filter */}
              <div className="mt-6 pt-6 border-t border-dark-100">
                <h3 className="font-semibold text-dark-900 mb-3">Disponibilitate</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" defaultChecked />
                  <span className="text-sm text-dark-600">Pe stoc</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <section className="lg:col-span-3">
            {/* Sorting */}
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-dark-100">
              <p className="text-dark-600">
                Afișează <span className="font-semibold">{products.length}</span> din <span className="font-semibold">{totalCount}</span> produse (Pagina {currentPage} din {totalPages})
              </p>
              <Suspense fallback={<div className="px-4 py-2 border border-dark-200 rounded-lg text-dark-700 text-sm" />}>
                <SortDropdown />
              </Suspense>
            </div>

            {/* Products */}
            {products.length > 0 ? (
              <>
                <div className="grid-products">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12 pt-8 border-t border-dark-100">
                    {currentPage > 1 && (
                      <Link
                        href={`/produse${params.cat ? `?cat=${params.cat}&page=${currentPage - 1}` : `?page=${currentPage - 1}`}`}
                        className="px-4 py-2 border border-dark-200 rounded-lg text-dark-700 hover:bg-dark-50 transition-colors font-semibold"
                      >
                        ← Pagina anterioară
                      </Link>
                    )}

                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <Link
                          key={pageNum}
                          href={`/produse${params.cat ? `?cat=${params.cat}&page=${pageNum}` : `?page=${pageNum}`}`}
                          className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                            pageNum === currentPage
                              ? 'bg-primary-600 text-white'
                              : 'border border-dark-200 text-dark-700 hover:bg-dark-50'
                          }`}
                        >
                          {pageNum}
                        </Link>
                      ))}
                    </div>

                    {currentPage < totalPages && (
                      <Link
                        href={`/produse${params.cat ? `?cat=${params.cat}&page=${currentPage + 1}` : `?page=${currentPage + 1}`}`}
                        className="px-4 py-2 border border-dark-200 rounded-lg text-dark-700 hover:bg-dark-50 transition-colors font-semibold"
                      >
                        Pagina următoare →
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-dark-600 text-lg mb-4">Nu am găsit produse în această categorie</p>
                <Link href="/produse" className="btn btn-primary">
                  Vezi Toate Produsele
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-primary-50">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold mb-4">Nu gasești ce cauți?</h2>
          <p className="text-dark-600 mb-8 max-w-2xl mx-auto">
            Contactează-ne pentru a obține o ofertă personalizată sau pentru a discuta cerintele specifice ale proiectului tău.
          </p>
          <Link href="/contact" className="btn btn-primary">
            Trimite Cerere
          </Link>
        </div>
      </section>
    </main>
  )
}

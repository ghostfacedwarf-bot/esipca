import Link from 'next/link'
import { getAllProducts, getCategories as fetchCategories } from '@/lib/db'
import ProductsClientView from './ProductsClientView'

// ISR - revalidate every 60 seconds for fresh data with caching
export const revalidate = 60

export const metadata = {
  title: 'Produse | Esipca Metalica',
  description: 'Catalog complet de șipcă metalică, tablă zincată și jgheaburi. Preturi competitive și livrare rapidă.',
}

export default async function ProdusePage() {
  const [allProducts, categories] = await Promise.all([
    getAllProducts(),
    fetchCategories(),
  ])

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
        <ProductsClientView
          allProducts={allProducts}
          categories={categories}
        />
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

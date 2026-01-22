import { getProductBySlug } from '@/lib/db'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import ProductOrderForm from './ProductOrderForm'
import ProductGallery from './ProductGallery'

// Mark as dynamic - fetch product at runtime
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Produs nu găsit | Esipca Metalica',
    }
  }

  return {
    title: `${product.name} | Esipca Metalica`,
    description: product.shortDescription || product.longDescription,
  }
}

async function getProduct(slug: string) {
  return await getProductBySlug(slug)
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const avgRating = product.reviews.length > 0
    ? Math.round(
        product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      )
    : 5

  return (
    <main>
      {/* Breadcrumb */}
      <div className="bg-dark-50 border-b border-dark-100 py-4">
        <div className="container-max text-sm text-dark-600">
          <a href="/" className="hover:text-dark-900">Home</a> / <a href="/produse" className="hover:text-dark-900">Produse</a> / <a href={`/produse?cat=${product.categoryId}`} className="hover:text-dark-900">{product.category.name}</a> / <span className="text-dark-900 font-semibold">{product.name}</span>
        </div>
      </div>

      {/* Product section */}
      <div className="container-max py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left - Images */}
          <div>
            <ProductGallery
              productName={product.name}
              category={product.category.name}
              media={product.media}
            />
          </div>

          {/* Right - Details */}
          <div>
            <div className="mb-2">
              <a href={`/produse?cat=${product.categoryId}`} className="text-primary-600 text-sm font-semibold hover:text-primary-700">
                {product.category.name}
              </a>
            </div>

            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>

            {/* Badges */}
            <div className="flex gap-2 mb-3">
              {product.isFeatured && (
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full">
                  FEATURED
                </span>
              )}
              {product.isBestseller && (
                <span className="inline-block px-3 py-1 bg-accent-100 text-accent-700 text-xs font-semibold rounded-full">
                  BEST SELLER
                </span>
              )}
              {product.variants?.[0]?.stockStatus === 'in_stock' && (
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  PE STOC
                </span>
              )}
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-4 mb-3 pb-3 border-b border-dark-100">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < avgRating ? 'text-yellow-400 text-lg' : 'text-dark-300 text-lg'}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-dark-600 text-sm">
                ({product.reviews.length} recenzii)
              </span>
            </div>

            {/* Price */}
            <div className="mb-4 p-4 bg-primary-50 rounded-lg">
              <p className="text-dark-600 text-sm mb-2">Preț de bază</p>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-primary-600">
                  {product.priceFrom}
                </span>
                <span className="text-xl text-dark-700">
                  RON/{product.priceType === 'per_meter' ? 'metru' : 'bucată'}
                </span>
              </div>
              {product.longDescription && (
                <p className="text-dark-600 text-sm mt-2">
                  Preț pentru informații suplimentare contactează-ne
                </p>
              )}
            </div>

            {/* Description */}
            {product.shortDescription && (
              <div className="mb-4">
                <p className="text-dark-700 leading-relaxed text-sm">
                  {product.shortDescription}
                </p>
              </div>
            )}

            {/* Specifications */}
            {product.specs && (
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-2">Specificații</h3>
                <div className="border border-dark-100 rounded-lg overflow-hidden">
                  {Object.entries(product.specs as Record<string, any>).map(([key, value], idx) => {
                    const translations: Record<string, string> = {
                      latime: 'Lățime',
                      profil: 'Profil',
                      culoare: 'Culoare',
                      finisaj: 'Finisaj',
                      grosime: 'Grosime',
                      discount: 'Discount',
                      material: 'Material',
                      bucinPerMetru: 'Bucăți/Metru',
                      prețOriginal: 'Preț Original',
                    }
                    const formattedKey = translations[key] || key.charAt(0).toUpperCase() + key.slice(1)
                    return (
                      <div key={key} className={`flex gap-4 p-2 ${idx % 2 === 0 ? 'bg-dark-50' : 'bg-white'}`}>
                        <div className="font-semibold text-dark-900 w-1/3 text-sm">{formattedKey}</div>
                        <div className="text-dark-700 w-2/3 text-sm">{String(value)}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Order Form */}
            <ProductOrderForm
              productId={product.id}
              productName={product.name}
              variants={product.variants as any}
              priceType={product.priceType}
              priceFrom={Number(product.priceFrom)}
              categoryName={product.category.name}
              specs={product.specs as any}
            />

            {/* Trust signals */}
            <div className="mt-4 p-4 bg-dark-50 rounded-lg">
              <h3 className="font-bold text-dark-900 mb-3">De ce să alegi această produs?</h3>
              <ul className="space-y-3 text-dark-700 text-sm">
                <li className="flex gap-3">
                  <span className="text-accent-500 font-bold">✓</span>
                  <span>Calitate garantată 30 ani</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent-500 font-bold">✓</span>
                  <span>Livrare rapidă 1-7 zile</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent-500 font-bold">✓</span>
                  <span>Consultanță profesională gratuită</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent-500 font-bold">✓</span>
                  <span>Plată securizată cu ramburs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Full description */}
      {product.longDescription && (
        <section className="py-8 bg-dark-50">
          <div className="container-max max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Descriere Completă</h2>
            <div className="prose prose-sm max-w-none text-dark-700 text-sm leading-relaxed">
              {product.longDescription}
            </div>
          </div>
        </section>
      )}

      {/* Reviews section */}
      {product.reviews.length > 0 && (
        <section className="py-8">
          <div className="container-max max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">Recenzii Clienți ({product.reviews.length})</h2>
            <div className="space-y-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="border-b border-dark-100 pb-4 last:border-0">
                  <div className="mb-2">
                    <p className="font-semibold text-dark-900 text-sm">{review.name}</p>
                    <div className="flex gap-0.5 my-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-dark-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {review.text && <p className="text-dark-700 text-sm">{review.text}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related products CTA */}
      <section className="py-8 bg-primary-600 text-white">
        <div className="container-max text-center">
          <h2 className="text-2xl font-bold mb-3">Explorează Alte Produse din {product.category.name}</h2>
          <a href={`/produse?cat=${product.categoryId}`} className="btn bg-white text-primary-600 hover:bg-primary-50 inline-flex items-center gap-2">
            Vezi Categoria Completa
            <ArrowRight size={20} />
          </a>
        </div>
      </section>
    </main>
  )
}

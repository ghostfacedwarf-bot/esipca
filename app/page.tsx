import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, CheckCircle, Zap, Shield, Users } from 'lucide-react'
import HeroSlider from './components/HeroSlider'
import FeaturedProductCard from './components/FeaturedProductCard'
import NewsletterForm from './components/NewsletterForm'
import { getFeaturedProducts } from '@/lib/db'

// Static metadata
export const metadata = {
  title: 'Esipca Metalica | Șipcă, Tablă și Jgheaburi de Calitate',
  description: 'Furnizor de șipcă metalică, tablă zincată și jgheaburi pentru construcții. 30 ani de experiență. Consultanță profesională și livrare rapidă în România.',
}

// Fallback products for homepage (used if database fetch fails)
const fallbackProducts = [
  {
    id: '1',
    name: 'Șipcă Metalică P1 - 7024 MAT',
    slug: 'sipca-metalica-p1-7024-mat',
    shortDescription: 'Șipcă metalică din oțel zincat, profil P1, culoare 7024 Negru Mat',
    priceFrom: 5.36,
    priceType: 'per_piece',
    isFeatured: true,
    isBestseller: true,
    media: [],
  },
  {
    id: '2',
    name: 'Șipcă Metalică P4 - Stejar (3D)',
    slug: 'sipca-metalica-p4-stejar',
    shortDescription: 'Șipcă metalică cu aspect de lemn stejar, profil P4, finisaj 3D',
    priceFrom: 6.46,
    priceType: 'per_piece',
    isFeatured: true,
    isBestseller: false,
    media: [],
  },
  {
    id: '3',
    name: 'Șipcă Metalică P2 - Zincat',
    slug: 'sipca-metalica-p2-zincat',
    shortDescription: 'Șipcă metalică zincată natural, profil P2, finisaj Aluminiu-Zinc',
    priceFrom: 4.56,
    priceType: 'per_piece',
    isFeatured: false,
    isBestseller: true,
    media: [],
  },
]

export default async function Home() {
  // Fetch featured products from database
  let recommendedProducts = fallbackProducts
  try {
    const dbProducts = await getFeaturedProducts(3)
    if (dbProducts && dbProducts.length > 0) {
      recommendedProducts = dbProducts
    }
  } catch (error) {
    console.error('[HOME] Error fetching featured products:', error)
  }

  return (
    <main>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Trust Signals Section */}
      <section className="py-12 bg-dark-50">
        <div className="container-max">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
              <Zap className="text-primary-600" size={32} />
              <div>
                <h3 className="font-semibold text-dark-900">Livrare Rapidă</h3>
                <p className="text-sm text-dark-500">1-7 zile</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
              <Users className="text-accent-500" size={32} />
              <div>
                <h3 className="font-semibold text-dark-900">Consultanță</h3>
                <p className="text-sm text-dark-500">Profesională</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
              <CheckCircle className="text-green-600" size={32} />
              <div>
                <h3 className="font-semibold text-dark-900">Garanție</h3>
                <p className="text-sm text-dark-500">30 ani</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
              <Shield className="text-blue-600" size={32} />
              <div>
                <h3 className="font-semibold text-dark-900">Plată Securizată</h3>
                <p className="text-sm text-dark-500">Ramburs inclus</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-dark-50">
        <div className="container-max">
          <h2 className="text-4xl font-bold text-center mb-4">Produse Recomandate</h2>
          <p className="text-center text-dark-600 mb-12 max-w-2xl mx-auto">
            Produse aleatoare din catalogul nostru
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {recommendedProducts.map((product) => (
              <FeaturedProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="flex justify-center gap-4 pt-12 flex-wrap">
            <Link href="/produse" className="btn btn-primary btn-lg">
              Vezi Toate Produsele
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link href="/configurator" className="btn btn-primary btn-lg">
              Configurator Gard
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side */}
            <div>
              <h2 className="text-4xl font-bold mb-6">Despre Esipca Metalica</h2>
              <div className="space-y-4 text-dark-600">
                <p>
                  Cu o experiență de peste 30 de ani pe piața produselor metalice, Esipca Metalica s-a impus ca furnizor de referință pentru construcții de calitate.
                </p>
                <p>
                  Prin combinația dintre tradiție și inovație, oferim produse metalice rezistente care îmbină <span className="font-semibold text-dark-900">frumusețea cu durabilitatea</span>.
                </p>
                <p>
                  Specializația noastră este șipcă metalică premium din oțel zincat DX 51, disponibilă în multiple culori RAL, profile diverse și dimensiuni personalizate, pentru proiecte de construcție rezidențiale și comerciale.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex gap-3">
                  <CheckCircle className="text-accent-500 flex-shrink-0" size={24} />
                  <span className="text-dark-700">Livrare rapidă în toată România</span>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="text-accent-500 flex-shrink-0" size={24} />
                  <span className="text-dark-700">Consultanță profesională pentru fiecare proiect</span>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="text-accent-500 flex-shrink-0" size={24} />
                  <span className="text-dark-700">Garanție de 30 ani pentru produsele noastre</span>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="text-accent-500 flex-shrink-0" size={24} />
                  <span className="text-dark-700">Prețuri competitive și oferă sprijin pe termen lung</span>
                </div>
              </div>
            </div>

            {/* Right side - About Image */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/about.png"
                alt="Despre Esipca Metalica"
                width={600}
                height={450}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Centered Button */}
          <div className="text-center mt-12">
            <Link href="/despre-noi" className="btn btn-primary">
              Citește Mai Multe
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container-max text-center">
          <h2 className="text-4xl font-bold mb-4">Suntem Gata să Te Ajutăm</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Contactează-ne astazi pentru a obține consultanță profesională și oferta cea mai bună pentru proiectul tău.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="tel:+40722292519" className="btn btn-outline text-white border-white hover:bg-white hover:text-primary-600">
              Sună-ne
            </a>
            <Link href="/contact" className="btn bg-white text-primary-600 hover:bg-primary-50">
              Trimite Mesaj
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-dark-50">
        <div className="container-max max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-4">Abonează-te la Newsletter</h2>
          <p className="text-center text-dark-600 mb-8">
            Primești oferte speciale, informații despre produse noi și sfaturi pentru construcții.
          </p>

          <NewsletterForm />

          <p className="text-xs text-dark-500 text-center mt-4">
            Respectăm privacitatea ta. Poți oricând să te dezabonezi.
          </p>
        </div>
      </section>
    </main>
  )
}

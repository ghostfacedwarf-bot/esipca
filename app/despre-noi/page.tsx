import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Award, Zap, Users, Shield, Star } from 'lucide-react'

export const metadata = {
  title: 'Despre Noi | Esipca Metalica - 30 Ani de Experiență',
  description: 'Afla povestea Esipca Metalica. Furnizor de șipcă metalică premium, tablă zincată și sisteme de pluvial. 30 de ani de experiență și warranty.',
}

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container-max">
          <h1 className="text-5xl font-bold mb-4">Despre Esipca Metalica</h1>
          <p className="text-xl text-primary-100 max-w-3xl">
            30 de ani de experiență în furnizarea de produse metalice premium de calitate pentru construcții și industrie
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-max py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* Left - Text */}
          <div>
            <h2 className="text-4xl font-bold mb-6 text-dark-900">Cine Suntem</h2>
            <div className="space-y-4 text-dark-700 text-lg leading-relaxed">
              <p>
                <strong>S.C. Sipca metalica S.R.L</strong> este o companie românească cu o bogată experiență de 30 de ani în producția și distribuția de produse metalice de calitate superioară.
              </p>
              <p>
                Ne-am impus pe piață prin combinația dintre tradiție și inovație, oferind soluții complete pentru construcții rezidențiale, comerciale și industriale. Reputația noastră se bazează pe calitate, fiabilitate și servicii profesionale.
              </p>
              <p>
                Specialitatea noastră este șipcă metalică din oțel zincat DX 51, disponibilă în diverse profile (P1-P9), culori RAL multiple și dimensiuni personalizate. Fiecare produs este supus unor standarde riguroase de control al calității.
              </p>
            </div>
          </div>

          {/* Right - Image */}
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

        {/* Core Values */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center text-dark-900">Valorile Noastre</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-dark-50 rounded-xl border border-dark-200 hover:border-primary-600 transition-colors">
              <Award size={40} className="text-accent-500 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-dark-900">Calitate Premium</h3>
              <p className="text-dark-600">
                Fiecare produs este confectionat din oțel zincat DX 51 cu vopsire electrostatica de cea mai inalta calitate. 30 de ani de garanție pentru defecte de fabricație.
              </p>
            </div>

            <div className="p-8 bg-dark-50 rounded-xl border border-dark-200 hover:border-primary-600 transition-colors">
              <Users size={40} className="text-primary-600 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-dark-900">Consultanță Profesională</h3>
              <p className="text-dark-600">
                Echipa noastră de specialiști oferă consultanță gratuită pentru fiecare proiect. Te ajutăm să alegi profilul, culoarea și dimensiunile potrivite.
              </p>
            </div>

            <div className="p-8 bg-dark-50 rounded-xl border border-dark-200 hover:border-primary-600 transition-colors">
              <Zap size={40} className="text-green-600 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-dark-900">Livrare Rapidă</h3>
              <p className="text-dark-600">
                Livrare în 1-7 zile în toată România. Transport gratuit pentru comenzi peste 350 RON. Diverse metode de plată disponibile.
              </p>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center text-dark-900">Portofoliul Nostru de Produse</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
              <h3 className="text-2xl font-bold mb-4 text-primary-900">Șipcă Metalică</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-primary-600 flex-shrink-0 mt-1" />
                  <span className="text-dark-700"><strong>Oțel Zincat DX 51</strong> - Rezistență la coroziune și intemperii</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-primary-600 flex-shrink-0 mt-1" />
                  <span className="text-dark-700"><strong>Profile diverse</strong> - P1 până la P9 pentru orice tip de gard</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-primary-600 flex-shrink-0 mt-1" />
                  <span className="text-dark-700"><strong>Culori RAL multiple</strong> - RAL 7024, 8017, 3011, 8004, 9005 și altele</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-primary-600 flex-shrink-0 mt-1" />
                  <span className="text-dark-700"><strong>Dimensiuni personalizate</strong> - Adaptate la nevoile exacte ale proiectului</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-xl bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200">
              <h3 className="text-2xl font-bold mb-4 text-accent-900">Alte Produse</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-accent-600 flex-shrink-0 mt-1" />
                  <span className="text-dark-700"><strong>Tablă Zincată</strong> - Pentru acoperișuri și construcții diverse</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-accent-600 flex-shrink-0 mt-1" />
                  <span className="text-dark-700"><strong>Țiglă Metalică</strong> - Elegantă și durabilă pentru acoperișuri</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-accent-600 flex-shrink-0 mt-1" />
                  <span className="text-dark-700"><strong>Sisteme de Pluvial</strong> - Canale și burlane de drenaj</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-accent-600 flex-shrink-0 mt-1" />
                  <span className="text-dark-700"><strong>Accesorii și Scule</strong> - Toate componentele necesare instalării</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-dark-50 rounded-2xl p-12 mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center text-dark-900">De Ce Să Alegi Esipca Metalica?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <Star size={32} className="text-accent-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2 text-dark-900">Experiență de 30 de Ani</h3>
                <p className="text-dark-600">
                  Trei decenii de know-how și mîestrie în producția de produse metalice de calitate.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Shield size={32} className="text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2 text-dark-900">Garanție de 30 de Ani</h3>
                <p className="text-dark-600">
                  Protecție completă împotriva defectelor de fabricație pe o perioadă de 3 decenii.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <CheckCircle size={32} className="text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2 text-dark-900">Vopsire Electrostatică</h3>
                <p className="text-dark-600">
                  Aplicarea profesională a vopselei asigură o protecție optimală și o aparență impecabilă.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Award size={32} className="text-primary-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2 text-dark-900">Servicii Complete</h3>
                <p className="text-dark-600">
                  De la consultanță inițială la livrare și suport post-vânzare, suntem alături de tine.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Zap size={32} className="text-accent-400 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2 text-dark-900">Livrare Rapidă</h3>
                <p className="text-dark-600">
                  1-7 zile în toată România, cu transport gratuit pentru comenzi peste 350 RON.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Users size={32} className="text-primary-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-lg mb-2 text-dark-900">Suport Dedicat</h3>
                <p className="text-dark-600">
                  Echipa noastră de specialiști este disponibilă pentru orice întrebare sau problemă.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100">
              <div className="text-4xl font-bold text-primary-600 mb-2">30+</div>
              <div className="text-dark-700 font-semibold">Ani Experiență</div>
            </div>
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-accent-50 to-accent-100">
              <div className="text-4xl font-bold text-accent-600 mb-2">100%</div>
              <div className="text-dark-700 font-semibold">Calitate Garantată</div>
            </div>
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
              <div className="text-4xl font-bold text-green-600 mb-2">1-7</div>
              <div className="text-dark-700 font-semibold">Zile Livrare</div>
            </div>
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-4xl font-bold text-blue-600 mb-2">30</div>
              <div className="text-dark-700 font-semibold">Ani Garanție</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Gata Să Începi Proiectul Tău?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Contactează-ne astazi pentru o consultanță profesională și o ofertă personalizată.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="tel:+40722292519" className="btn btn-outline text-white border-white hover:bg-white hover:text-primary-600">
              Sună-ne: +40 (722) 292 519
            </a>
            <Link href="/contact" className="btn bg-white text-primary-600 hover:bg-primary-50">
              Trimite Mesaj
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

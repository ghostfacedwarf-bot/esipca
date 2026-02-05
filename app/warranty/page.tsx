import Link from 'next/link'
import { Shield, CheckCircle, AlertCircle, Clock, FileText, Award } from 'lucide-react'

export const metadata = {
  title: 'Garanție | Esipca Metalica - 30 Ani de Protecție',
  description: 'Garanție de 30 de ani pentru produsele metalice. Ce acoperă garanția, cum să revendici și cum funcționează protecția produselor.',
}

export default function WarrantyPage() {
  return (
    <main>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container-max">
          <h1 className="text-4xl font-bold mb-2">Garanție 30 de Ani</h1>
          <p className="text-primary-100">
            Protecție completă pentru produsele metalice Esipca Metalica
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-max py-16">
        <div className="max-w-2xl mx-auto">
          {/* Overview */}
          <section className="mb-16">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-12 rounded-lg border border-primary-200 mb-12">
              <div className="flex items-start gap-4">
                <Award size={48} className="text-primary-600 flex-shrink-0" />
                <div>
                  <h2 className="text-3xl font-bold text-dark-900 mb-4">30 de Ani de Garanție</h2>
                  <p className="text-lg text-dark-700 mb-4">
                    Fiecare produs metalic de la Esipca Metalica vine cu o <strong>garanție de 30 de ani</strong> pentru defectele de fabricație.
                  </p>
                  <p className="text-dark-600">
                    Aceasta este una dintre cele mai lungi perioade de garanție din industrie și reflectă încrederea noastră în calitatea produselor.
                  </p>
                </div>
              </div>
            </div>

            {/* Key Points */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="p-6 bg-dark-50 rounded-lg border border-dark-200">
                <Clock size={32} className="text-accent-500 mb-4" />
                <h3 className="text-xl font-bold text-dark-900 mb-2">Period de Garanție</h3>
                <p className="text-dark-600">
                  <strong>30 de ani calendaristici</strong> de la data achiziției produsului.
                </p>
              </div>

              <div className="p-6 bg-dark-50 rounded-lg border border-dark-200">
                <Shield size={32} className="text-primary-600 mb-4" />
                <h3 className="text-xl font-bold text-dark-900 mb-2">Tip de Garanție</h3>
                <p className="text-dark-600">
                  <strong>Garanție Limitată</strong> - acoperă defectele de fabricație și materialelor.
                </p>
              </div>
            </div>
          </section>

          {/* What's Covered */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-dark-900 mb-8">Ce Acoperă Garanția?</h2>

            <div className="bg-green-50 p-8 rounded-lg border border-green-200 mb-8">
              <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-2">
                <CheckCircle size={28} className="text-green-600" />
                Defecte Acoperite
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-dark-900">Defecte de Fabricație</h4>
                    <p className="text-dark-600 text-sm">
                      Probleme în procesul de producție, sudori defectuoase, materiale neconforme.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-dark-900">Defecte ale Materialului</h4>
                    <p className="text-dark-600 text-sm">
                      Oțel cu defecte interne, zincare incompletă, vopsea de slabă calitate.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-dark-900">Perforație datorită Coroziunii</h4>
                    <p className="text-dark-600 text-sm">
                      Gaura în material datorită coroziunii înainte de termenul normal (3+ ani).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-dark-900">Deformări Structurale</h4>
                    <p className="text-dark-600 text-sm">
                      Curbură sau deformare care nu este datorată instalării sau încărcării neadecvate.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-dark-900">Defecte în Componentele</h4>
                    <p className="text-dark-600 text-sm">
                      Capse, șuruburi, sau alte componente care nu funcționează din cauza defectelor de fabricație.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-8 rounded-lg border border-red-200">
              <h3 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-2">
                <AlertCircle size={28} className="text-red-600" />
                Ce NU Acoperă Garanția
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-dark-900">Uzura Normală</h4>
                    <p className="text-dark-600 text-sm">
                      Decolorarea, pierderea strălucimii, micro-crăpături din uzura în timp.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-dark-900">Instalație Incorectă</h4>
                    <p className="text-dark-600 text-sm">
                      Daune cauzate de instalare greșită, nerespectarea instrucțiunilor, sau incompetență.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-dark-900">Daune Mecanice</h4>
                    <p className="text-dark-600 text-sm">
                      Rupturi, deformări, sau daune din lovituri, căderi, sau impact.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-dark-900">Coroziune din Mediu Agresiv</h4>
                    <p className="text-dark-600 text-sm">
                      Coroziune datorată expunerii extreme (sare, chimicaluri, mediu industrial agresiv), nu acoperă pentru zona de coastă.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-dark-900">Modificări și Reparații Neautorizate</h4>
                    <p className="text-dark-600 text-sm">
                      Daune cauzate de modificări, tăieturi, sudări sau alte intervenții neautorizate.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-dark-900">Produse Personalizate</h4>
                    <p className="text-dark-600 text-sm">
                      Comenzile pe măsură sau personalizate pot avea garanții diferite (consultă termenii de vânzare).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-dark-900">Puterea Soarelui și Factori Naturali</h4>
                    <p className="text-dark-600 text-sm">
                      Fading sau decolorare datorată exponerii lungi la soare (este normal și fizic inevitabil).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Warranty Process */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-dark-900 mb-8">Cum să Revendici Garanția</h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-dark-900 mb-2">Contactează-ne Imediat</h4>
                  <p className="text-dark-600">
                    Odată ce observi o problemă, contactează-ne cât mai curând. Trebuie să raportezi defectul <strong>în termen rezonabil</strong> de la descoperire. Oferă detalii clare și poze cu problema.
                  </p>
                  <p className="text-dark-600 mt-2">
                    📧 Email: <strong>clienti@metalfence.ro</strong><br />
                    📞 Telefon: <strong>+40 (722) 292 519</strong>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-dark-900 mb-2">Furnizează Documente</h4>
                  <p className="text-dark-600">
                    Ai nevoie de:
                  </p>
                  <ul className="list-disc ml-6 text-dark-600 mt-2">
                    <li>Chitanță sau factură de cumpărare</li>
                    <li>Fotografie sau video cu defectul</li>
                    <li>Descriere detaliată a problemei</li>
                    <li>Data observării defectului</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-dark-900 mb-2">Evaluare de Garanție</h4>
                  <p className="text-dark-600">
                    Echipa noastră va evalua revendicarea ta. Putem cere fotografii suplimentare sau informații. Această evaluare durează de obicei 5-10 zile lucrătoare.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-dark-900 mb-2">Aprobarea sau Respingerea</h4>
                  <p className="text-dark-600">
                    Vei fi informat dacă revendicarea este aprobată. Dacă este aprobată, vom discuta opțiunile (înlocuire, reparație, credit).
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h4 className="font-bold text-dark-900 mb-2">Soluționare</h4>
                  <p className="text-dark-600">
                    Vei primi produsul de înlocuire, o reparație sau un credit pe cont. Transport și instalație sunt în răspunderea noastră pentru produsele defecte.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Warranty Options */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-dark-900 mb-8">Opțiuni de Soluționare</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200">
                <CheckCircle size={32} className="text-primary-600 mb-4" />
                <h3 className="text-xl font-bold text-dark-900 mb-3">Înlocuire</h3>
                <p className="text-dark-600">
                  Primești un produs nou care înlocuiește cel defect. Transport gratuit.
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg border border-accent-200">
                <CheckCircle size={32} className="text-accent-600 mb-4" />
                <h3 className="text-xl font-bold text-dark-900 mb-3">Reparație</h3>
                <p className="text-dark-600">
                  Reparăm produsul defect gratuit. Transport dus și întors inclus.
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <CheckCircle size={32} className="text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-dark-900 mb-3">Credit</h3>
                <p className="text-dark-600">
                  Primești credit pentru a cumpăra alt produs de aceeași valoare.
                </p>
              </div>
            </div>
          </section>

          {/* Legal Guarantee */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-dark-900 mb-8">Garanție Legală</h2>

            <div className="bg-blue-50 p-8 rounded-lg border border-blue-200">
              <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <FileText size={28} className="text-blue-600" />
                Conformitate cu Legea Română
              </h3>
              <p className="text-dark-600 mb-4">
                Pe lângă garanția de 30 de ani oferită de noi, ai și <strong>protecție legală de 2 ani</strong> conform Ordonanței de Urgență 34/2014 și legislației europene de protecție a consumatorului.
              </p>
              <div className="space-y-3 mt-4">
                <div>
                  <h4 className="font-bold text-dark-900">Garanție Legală: 2 Ani</h4>
                  <p className="text-dark-600 text-sm">
                    Produsele trebuie să fie conforme cu descrierea și funcționalitate pe o perioadă de 2 ani de la cumpărare.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-dark-900">Dreptul de Reclama: 30 de Zile</h4>
                  <p className="text-dark-600 text-sm">
                    Dacă observi defecte în primele 30 de zile, presupunem că defectul exista deja la cumpărare (inversiunea sarcinii probei).
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Extended Warranty */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-dark-900 mb-8">Garanție Extinsă (Opțional)</h2>

            <div className="bg-dark-50 p-8 rounded-lg border border-dark-200">
              <p className="text-dark-600 mb-4">
                Ofertele noastre standard includ garanția de 30 de ani. Dacă dorești <strong>protecție suplimentară</strong> care să acopere și anumite tipuri de daune accidentale sau uzură accelerată, suntem disponibili să discutam opțiuni de garanție extinsă personalizată.
              </p>
              <p className="text-dark-600">
                Contactează-ne pentru detalii despre programele de garanție extinsă.
              </p>
            </div>
          </section>

          {/* Contact */}
          <div className="bg-dark-900 text-white p-8 rounded-lg mb-16">
            <h3 className="text-2xl font-bold mb-6">Contactează-ne pentru Garanție</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-dark-300 mb-2">📧 Email:</p>
                <a href="mailto:clienti@metalfence.ro" className="text-accent-400 font-semibold hover:text-accent-300">
                  clienti@metalfence.ro
                </a>
              </div>
              <div>
                <p className="text-sm text-dark-300 mb-2">📞 Telefon:</p>
                <a href="tel:+40722292519" className="text-accent-400 font-semibold hover:text-accent-300">
                  +40 (722) 292 519
                </a>
              </div>
              <div>
                <p className="text-sm text-dark-300 mb-2">🕐 Program:</p>
                <p className="text-dark-200">
                  Luni - Vineri: 09:00 - 17:00<br />
                  Sâmbătă: 09:00 - 13:00<br />
                  Duminică: Închis
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-dark-900 mb-8">Întrebări Frecvente despre Garanție</h2>
            <div className="space-y-4">
              <details className="bg-white p-6 rounded-lg border border-dark-100 cursor-pointer group">
                <summary className="font-bold text-dark-900 flex justify-between items-center">
                  <span>Garanția de 30 de ani e valabilă peste tot?</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-dark-600 mt-4">
                  Da, garanția de 30 de ani e valabilă în toată România și UE pentru produsele cumpărate de la noi. Nu include transport internațional.
                </p>
              </details>

              <details className="bg-white p-6 rounded-lg border border-dark-100 cursor-pointer group">
                <summary className="font-bold text-dark-900 flex justify-between items-center">
                  <span>Pot transfera garanția dacă vând produsul?</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-dark-600 mt-4">
                  Garanția este nominală pentru cumpărătorul original. Dacă vinde proprietatea, garanția poate fi transferată cu notificare scrisă.
                </p>
              </details>

              <details className="bg-white p-6 rounded-lg border border-dark-100 cursor-pointer group">
                <summary className="font-bold text-dark-900 flex justify-between items-center">
                  <span>Ce se întâmplă dacă produsul se rupe după 2 ani?</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-dark-600 mt-4">
                  Dacă ruptura e datorată unui defect de fabricație (nu uzurii normale), garanția noastră de 30 de ani o acoperă. Trebuie să furnizezi dovezi ale defectului.
                </p>
              </details>

              <details className="bg-white p-6 rounded-lg border border-dark-100 cursor-pointer group">
                <summary className="font-bold text-dark-900 flex justify-between items-center">
                  <span>Cine plătește transportul pentru revendicări de garanție?</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-dark-600 mt-4">
                  Pentru defecte de fabricație aprobate, noi plătim transportul dus și întors. Pentru alte cazuri, trebuie discutat individual.
                </p>
              </details>

              <details className="bg-white p-6 rounded-lg border border-dark-100 cursor-pointer group">
                <summary className="font-bold text-dark-900 flex justify-between items-center">
                  <span>Ce se întâmplă dacă garanția expirează?</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-dark-600 mt-4">
                  După expirarea perioadei de garanție, nu mai suntem obligați să reparăm sau să înlocuim. Cu toate acestea, suntem întotdeauna disponibili pentru reparații contra plată.
                </p>
              </details>
            </div>
          </section>
        </div>
      </div>

      {/* CTA */}
      <section className="py-16 bg-dark-50">
        <div className="container-max max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Încrezut în Calitate</h2>
          <p className="text-dark-600 mb-8">
            Garanția de 30 de ani este dovada angajamentului nostru față de calitate. Cumpără cu încredere!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/produse" className="btn btn-primary">
              Vezi Produse
            </Link>
            <Link href="/contact" className="btn btn-outline">
              Contactează-ne
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

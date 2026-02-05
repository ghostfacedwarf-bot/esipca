import Link from 'next/link'
import { Truck, RotateCcw, CheckCircle, AlertCircle, Package, MapPin } from 'lucide-react'

export const metadata = {
  title: 'Livrare și Returnări | Esipca Metalica',
  description: 'Politica de livrare și returnare. Cum sunt livrate produsele, tarifare transport, și procedura de returnare în 14 zile.',
}

export default function ShippingReturnsPage() {
  return (
    <main>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container-max">
          <h1 className="text-4xl font-bold mb-2">Livrare și Returnări</h1>
          <p className="text-primary-100">
            Informații complete despre transport și procesul de returnare
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-max py-16">
        <div className="max-w-2xl mx-auto">
          {/* Livrare Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Truck size={40} className="text-primary-600" />
              <h2 className="text-4xl font-bold text-dark-900">Livrare</h2>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200">
                <div className="text-3xl font-bold text-primary-600 mb-2">1-7</div>
                <div className="text-dark-700 font-semibold">Zile Livrare</div>
                <p className="text-xs text-dark-600 mt-2">În toată România</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-accent-50 to-accent-100 rounded-lg border border-accent-200">
                <div className="text-3xl font-bold text-accent-600 mb-2">Gratuit</div>
                <div className="text-dark-700 font-semibold">Transport</div>
                <p className="text-xs text-dark-600 mt-2">Peste 350 RON</p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                <div className="text-dark-700 font-semibold">Asigurat</div>
                <p className="text-xs text-dark-600 mt-2">Toate coletele</p>
              </div>
            </div>

            {/* Shipping Process */}
            <div className="space-y-8 mb-12">
              <div>
                <h3 className="text-2xl font-bold text-dark-900 mb-6">Cum Funcționează Livrarea?</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-dark-900 mb-2">Plasezi Comanda</h4>
                      <p className="text-dark-600">
                        Selectezi produsele, cantitatea și metoda de plată. Primești confirmarea comenzii pe email.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-dark-900 mb-2">Procesarea Comenzii</h4>
                      <p className="text-dark-600">
                        Comanda este verificată și procesată. Produsele sunt pregatite pentru expediere (1-2 zile).
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-dark-900 mb-2">Expediere</h4>
                      <p className="text-dark-600">
                        Coletul este predat partenerului de transport. Vei primi cod de urmărire prin email.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold text-dark-900 mb-2">Transport</h4>
                      <p className="text-dark-600">
                        Coletul este în tranzit către adresa ta. Poți urmări livrarea în timp real cu codul de urmărire.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                      5
                    </div>
                    <div>
                      <h4 className="font-bold text-dark-900 mb-2">Livrare</h4>
                      <p className="text-dark-600">
                        Primești coletul la adresa indicată. Verifică integritatea produselor la primire.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Areas */}
            <div className="bg-dark-50 p-8 rounded-lg border border-dark-200 mb-12">
              <h3 className="text-2xl font-bold text-dark-900 mb-6 flex items-center gap-2">
                <MapPin size={28} className="text-primary-600" />
                Arii de Livrare
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-dark-900 mb-2">România - Livrare în Toată Țara</h4>
                  <p className="text-dark-600 mb-4">
                    Livrăm în toate județele din România, inclusiv în localități mai mici. Termenul standard este 1-7 zile lucrătoare.
                  </p>
                  <ul className="space-y-2 text-dark-600">
                    <li className="flex gap-2">
                      <CheckCircle size={20} className="text-accent-500 flex-shrink-0" />
                      <span><strong>București și Județul Ilfov:</strong> 1-2 zile</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle size={20} className="text-accent-500 flex-shrink-0" />
                      <span><strong>Județele Limitrofe:</strong> 2-3 zile</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle size={20} className="text-accent-500 flex-shrink-0" />
                      <span><strong>Restul Țării:</strong> 3-7 zile</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Shipping Costs */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-8 rounded-lg border border-primary-200 mb-12">
              <h3 className="text-2xl font-bold text-dark-900 mb-6">Tarif Transport</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-primary-300">
                  <span className="font-semibold text-dark-900">Comenzi sub 350 RON</span>
                  <span className="text-lg font-bold text-primary-600">Se calculează la checkout</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-dark-900">Comenzi de 350 RON și peste</span>
                  <span className="text-lg font-bold text-green-600">Transport GRATUIT</span>
                </div>
              </div>
              <p className="text-sm text-dark-600 mt-6">
                *Tarifele de transport se calculează în funcție de zona de livrare și greutatea coletului. Vei vedea costul exact la etapa de finalizare a comenzii.
              </p>
            </div>

            {/* Payment Methods */}
            <div>
              <h3 className="text-2xl font-bold text-dark-900 mb-6">Metode de Plată la Livrare</h3>
              <p className="text-dark-600 mb-6">
                Pentru clienții care aleg <strong>Ramburs</strong> (plată la livrare):
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-accent-500 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-dark-900">Plată în Numerar</strong>
                    <p className="text-dark-600 text-sm">Plătești curier-ul în numerar la primire</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle size={20} className="text-accent-500 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-dark-900">Plată cu Card</strong>
                    <p className="text-dark-600 text-sm">Unii curieri acceptă plată cu card bancar</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <AlertCircle size={20} className="text-orange-500 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-dark-900">Taxa Ramburs</strong>
                    <p className="text-dark-600 text-sm">Se adaugă o mică taxă de ramburs (aproximativ 2-3% din valoare)</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Divider */}
          <div className="my-16 border-t-2 border-dark-200"></div>

          {/* Returnări Section */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <RotateCcw size={40} className="text-accent-500" />
              <h2 className="text-4xl font-bold text-dark-900">Returnări</h2>
            </div>

            {/* Return Period */}
            <div className="bg-accent-50 p-8 rounded-lg border border-accent-200 mb-12">
              <h3 className="text-2xl font-bold text-dark-900 mb-4">Dreptul de Retragere - 14 Zile</h3>
              <p className="text-dark-600 mb-4">
                Conform legii europene de protecție a consumatorului (Directiva 2011/83/EU), ai <strong>14 zile calendaristice</strong> de la primirea produselor pentru a te retrage din contract fără a fi obligat să dai explicații.
              </p>
              <p className="text-dark-600">
                <strong>Termen de calcul:</strong> 14 zile se calculează de la data primerii coletului (nu de la plasarea comenzii).
              </p>
            </div>

            {/* Return Process */}
            <div className="space-y-8 mb-12">
              <div>
                <h3 className="text-2xl font-bold text-dark-900 mb-6">Cum Retragi o Comandă?</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-500 text-white flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-dark-900 mb-2">Contactează-ne în Termen</h4>
                      <p className="text-dark-600">
                        Trebuie să ne notifici dorința de retragere în termen de <strong>14 zile</strong> de la primire. Contactează-ne prin email la <strong>clienti@metalfence.ro</strong> sau telefon la <strong>+40 (722) 292 519</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-500 text-white flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-dark-900 mb-2">Pregătirea pentru Returnare</h4>
                      <p className="text-dark-600">
                        Produsele trebuie să fie în stare de nefolosire (nedesfăcute dacă este posibil, în ambalajul original). Vei primi instrucțiuni detaliate despre cum și unde să returnezi produsele.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-500 text-white flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-dark-900 mb-2">Aranjament Transport</h4>
                      <p className="text-dark-600">
                        <strong>TU plătești costul de transport</strong> pentru returnarea produselor la noi. Poți folosi orice curier sau serviciu de transport pe care îl consideri convenabil.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-500 text-white flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold text-dark-900 mb-2">Trimiterea Produselor</h4>
                      <p className="text-dark-600">
                        Trimite produsele înapoi la adresa pe care ți-o vom furniza. Asigură-te că ții evidența codului de urmărire pentru a putea verifica livrarea.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-500 text-white flex items-center justify-center font-bold">
                      5
                    </div>
                    <div>
                      <h4 className="font-bold text-dark-900 mb-2">Verificare și Rambursare</h4>
                      <p className="text-dark-600">
                        După ce primim și verificăm produsele, vei fi rambursat integral în <strong>14 zile de calendar</strong>. Rambursarea se va face la metoda de plată originală.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Return Conditions */}
            <div className="bg-dark-50 p-8 rounded-lg border border-dark-200 mb-12">
              <h3 className="text-2xl font-bold text-dark-900 mb-6">Condiții de Returnare</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-green-600 text-lg mb-3 flex items-center gap-2">
                    <CheckCircle size={20} />
                    Acceptăm Returnări Dacă:
                  </h4>
                  <ul className="space-y-2 text-dark-600 ml-8">
                    <li>✓ Produsele sunt nefolosite și în stare bună</li>
                    <li>✓ Ambalajul original este intact</li>
                    <li>✓ Nu au semne de deteriorare, zgârieturi sau uzură</li>
                    <li>✓ Sunt însoțite de toate documentele (factură, chitanță)</li>
                    <li>✓ Returnarea se face în termenul de 14 zile</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-red-600 text-lg mb-3 flex items-center gap-2">
                    <AlertCircle size={20} />
                    Nu Acceptăm Returnări Dacă:
                  </h4>
                  <ul className="space-y-2 text-dark-600 ml-8">
                    <li>✗ Produsele au fost utilizate sau instalate</li>
                    <li>✗ Ambalajul a fost deschis sau deteriorat</li>
                    <li>✗ Au semne evidente de uzură sau daune</li>
                    <li>✗ Sunt comandă personalizată sau pe măsură</li>
                    <li>✗ A trecut perioada de 14 zile</li>
                    <li>✗ Produsele sunt vândute la reducere (în anumite condiții)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Costs */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-lg border border-orange-200 mb-12">
              <h3 className="text-2xl font-bold text-dark-900 mb-6">Costuri de Returnare</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-orange-300">
                  <span className="font-semibold text-dark-900">Transport Retur</span>
                  <span className="text-lg font-bold text-orange-600">Cumpărătorul plătește</span>
                </div>
                <p className="text-sm text-dark-600 mt-4">
                  Conform legii de protecție a consumatorului, cumpărătorul suportă costul transport pentru returnare, cu excepția cazului în care produsul este defect sau nu corespunde descrierii.
                </p>
              </div>
            </div>

            {/* Defect Returns */}
            <div className="bg-blue-50 p-8 rounded-lg border border-blue-200 mb-12">
              <h3 className="text-2xl font-bold text-dark-900 mb-6">Returnări Datorita Defectelor</h3>
              <p className="text-dark-600 mb-4">
                Dacă primești un produs defect sau deteriorat din cauza noastră (deteriorare în transport, defect de fabricație), returnarea este <strong>gratuită pentru tine</strong>.
              </p>
              <div className="space-y-3 text-dark-600">
                <p>
                  <strong>Ce trebuie să faci:</strong>
                </p>
                <ul className="space-y-2 ml-6">
                  <li>1. Contactează-ne în max 48 de ore de la primire</li>
                  <li>2. Furnizează poze cu produsul defect/deteriorat</li>
                  <li>3. Vem contacta cu etichetă de retur și instrucțiuni</li>
                  <li>4. Transport GRATUIT pentru retur</li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-dark-900 text-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6">Contactează-ne pentru Returnări</h3>
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
          </section>
        </div>
      </div>

      {/* CTA */}
      <section className="py-16 bg-dark-50">
        <div className="container-max max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Mai Ai Întrebări?</h2>
          <p className="text-dark-600 mb-8">
            Suntem aici să te ajutăm. Contactează-ne și vom răspunde în 24 de ore.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="tel:+40722292519" className="btn btn-primary">
              Sună-ne
            </a>
            <Link href="/contact" className="btn btn-outline">
              Trimite Mesaj
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

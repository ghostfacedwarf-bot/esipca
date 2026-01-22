export const metadata = {
  title: 'Termeni și Condiții | Esipca Metalica',
  description: 'Termeni și condiții de utilizare a site-ului și serviciilor Esipca Metalica. Politica de returnare, garanție și conformitate.',
}

export default function TermsPage() {
  return (
    <main>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container-max">
          <h1 className="text-4xl font-bold mb-2">Termeni și Condiții</h1>
          <p className="text-primary-100">Condiții de utilizare a site-ului și serviciilor Esipca Metalica</p>
        </div>
      </div>

      {/* Content */}
      <div className="container-max py-16">
        <div className="max-w-4xl mx-auto prose prose-lg">
          {/* Last Updated */}
          <div className="bg-dark-50 p-6 rounded-lg mb-8 border-l-4 border-primary-600">
            <p className="text-sm text-dark-600 mb-1">
              <strong>Ultima actualizare:</strong> Ianuarie 2026
            </p>
            <p className="text-sm text-dark-600">
              Aceți termeni și condiții se aplică pentru site-ul www.esipcametalica.ro și serviciile asociate.
            </p>
          </div>

          {/* 1. Definiții */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">1. Definiții și Termeni</h2>
            <p className="text-dark-700 mb-4">În acest document, următorii termeni au următoarele semnificații:</p>
            <ul className="list-disc ml-6 text-dark-700 space-y-2">
              <li><strong>Furnizor/Compania:</strong> SC ROMEXPRES TRADING SRL, CUI RO31361919, cu sediul în Galaţi, Nicolae Gamulea 12</li>
              <li><strong>Client/Dumneavoastră:</strong> Orice persoană fizică sau juridică care utilizează site-ul și serviciile</li>
              <li><strong>Produse:</strong> Șipcă metalică din oțel zincat și serviciile asociate</li>
              <li><strong>Site-ul:</strong> www.esipcametalica.ro și subpaginile acestuia</li>
              <li><strong>Comandă:</strong> Cererea de cumpărare a produselor prin site</li>
              <li><strong>Contract:</strong> Acordul între Furnizor și Client privind vânzarea de produse</li>
            </ul>
          </section>

          {/* 2. Acceptarea Termenilor */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">2. Acceptarea Termenilor și Condițiilor</h2>
            <p className="text-dark-700 mb-4">
              Prin utilizarea site-ului și plasarea unei comenzi, dvs. acceptați în totalitate acești termeni și condiții. Dacă nu sunteți de acord cu aceștia, vă rugăm să nu utilizați site-ul.
            </p>
            <ul className="list-disc ml-6 text-dark-700 space-y-2">
              <li>Trebuie să aveți cel puțin 18 ani pentru a utiliza site-ul și a plasa comenzi</li>
              <li>Furnizorul are dreptul de a modifica acești termeni oricând, cu notificare prealabilă</li>
              <li>Utilizarea continuă a site-ului constituie acceptarea oricăror modificări</li>
            </ul>
          </section>

          {/* 3. Produse și Servicii */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">3. Produse și Servicii</h2>
            <p className="text-dark-700 mb-4">
              Oferim șipcă metalică din oțel zincat DX 51, disponibilă în diverse profile, culori RAL, dimensiuni și variante.
            </p>
            <ul className="list-disc ml-6 text-dark-700 space-y-2">
              <li>Descrierile și imaginile produselor sunt cât mai exacte posibil</li>
              <li>Nu garantez acuratețea 100% a imaginilor (pot varia ușor culoarea și aspect)</li>
              <li>Informațiile tehnice sunt corecte conform specificațiilor fabricantului</li>
              <li>Disponibilitatea produselor este în funcție de stocul actual</li>
              <li>Prețurile sunt în RON și includ TVA (21%)</li>
            </ul>
          </section>

          {/* 4. Procesul de Comandă */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">4. Procesul de Comandă</h2>
            <p className="text-dark-700 mb-4">Plasarea unei comenzi se realizează prin următorii pași:</p>
            <ol className="list-decimal ml-6 text-dark-700 space-y-2">
              <li>Selectați produsele și cantitatea dorită</li>
              <li>Completați informațiile de livrare și contact</li>
              <li>Alegeti metoda de plată</li>
              <li>Revizuiți și confirmați comanda</li>
              <li>Primiți confirmarea comenzii pe email</li>
            </ol>
            <p className="text-dark-700 mt-4">
              <strong>Acceptarea comenzii:</strong> Furnizorul are dreptul de a accepta sau refuza orice comandă fără a fi obligat să ofere explicații. Confirmarea comenzii pe email constituie acceptarea acesteia.
            </p>
          </section>

          {/* 5. Prețuri și Plată */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">5. Prețuri și Plată</h2>
            <p className="text-dark-700 mb-4">
              Toate prețurile sunt afișate în RON și includ TVA 21%.
            </p>
            <h3 className="text-xl font-bold mb-3 text-dark-800">Metode de plată acceptate:</h3>
            <ul className="list-disc ml-6 text-dark-700 space-y-2 mb-6">
              <li><strong>Card online:</strong> Netopia - procesare sigură și criptată</li>
              <li><strong>Ramburs:</strong> Plată la livrare (transport + plată la livrator)</li>
              <li><strong>Transfer bancar:</strong> Direct în contul companiei</li>
            </ul>

            <h3 className="text-xl font-bold mb-3 text-dark-800">Condiții plată:</h3>
            <ul className="list-disc ml-6 text-dark-700 space-y-2 mb-6">
              <li>Plata trebuie efectuată înainte de procesarea comenzii (pentru card și transfer)</li>
              <li>Pentru ramburs, plata se face la primirea coletului</li>
              <li>Factura va fi emitată în termen de 5 zile după confirmarea plații</li>
              <li>Doar persoane cu venit România vor primi facturi; altfel se emit chitanțe</li>
            </ul>

            <div className="bg-primary-50 p-4 rounded mb-6">
              <p className="text-dark-700">
                <strong>Livrare gratuită:</strong> Pentru comenzi cu valoare &gt;350 RON (fără plată transport)
              </p>
            </div>
          </section>

          {/* 6. Livrare */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">6. Livrare</h2>
            <ul className="list-disc ml-6 text-dark-700 space-y-2">
              <li><strong>Timp de livrare:</strong> 1-7 zile lucrătoare după procesarea comenzii</li>
              <li><strong>Zonă de livrare:</strong> România (transport asigurat prin parteneri curierat)</li>
              <li><strong>Transport:</strong> Gratuit pentru comenzi &gt;350 RON; altfel se aplică tarif</li>
              <li><strong>Riscul pierderii/deteriorării:</strong> Trec din responsabilitate furnizorului la client la consemnarea coletului</li>
              <li><strong>Întârzieri:</strong> Furnizorul nu este responsabil pentru întârzierile de livrare din cauze externe (vreme, trafic, etc.)</li>
            </ul>
            <p className="text-dark-700 mt-4">
              <strong>Important:</strong> Verificați coletul la primire și raportați orice deteriorări imediat curierului (în termen de 3 zile).
            </p>
          </section>

          {/* 7. Dreptul de Retragere */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">7. Dreptul de Retragere (Retur 14 Zile)</h2>
            <p className="text-dark-700 mb-4">
              Conform legislației de protecție a consumatorilor UE, aveți dreptul de a vă retrage din contract în termen de <strong>14 zile calendaristice</strong> de la primirea comenzii, fără a fi nevoie să oferiți explicații.
            </p>

            <h3 className="text-xl font-bold mb-3 text-dark-800">Condiții retur:</h3>
            <ul className="list-disc ml-6 text-dark-700 space-y-2 mb-6">
              <li>Produsul trebuie să fie <strong>nefolosit și în ambalajul original</strong></li>
              <li>Trebuie să contactați furnizorul în scris (email) pentru a iniția procesul de retur</li>
              <li>Produsele deteriorate din culpa dumneavoastră nu pot fi returnate</li>
              <li><strong>Costurile de retur sunt suportate de client</strong> (transport retur)</li>
            </ul>

            <h3 className="text-xl font-bold mb-3 text-dark-800">Proces retur:</h3>
            <ol className="list-decimal ml-6 text-dark-700 space-y-2 mb-6">
              <li>Contactați office@exprestrading.com cu detaliile comenzii</li>
              <li>Primiți instrucțiuni pentru trimiterea produsului înapoi</li>
              <li>Trimiteți produsul înapoi (costul curierului pe dvs.)</li>
              <li>După primirea și verificarea produsului, se procesează rambursarea</li>
              <li>Rambursarea se va face în termen de <strong>14 zile</strong> după primirea produsului</li>
            </ol>

            <div className="bg-dark-50 p-4 rounded">
              <p className="text-dark-700 text-sm">
                <strong>Excepții:</strong> Dreptul de retragere nu se aplică pentru produsele personalizate/comandate pe măsură sau produsele deteriorate datorită utilizării.
              </p>
            </div>
          </section>

          {/* 8. Garanție */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">8. Garanție</h2>
            <p className="text-dark-700 mb-4">
              Furnizorul oferă <strong>garanție limitată de 30 ani</strong> pentru produsele din oțel zincat.
            </p>

            <h3 className="text-xl font-bold mb-3 text-dark-800">Acoperire garanție:</h3>
            <ul className="list-disc ml-6 text-dark-700 space-y-2 mb-6">
              <li>Defecte de fabricație și vici ascunse</li>
              <li>Spargeri, fisuri datorite defectelor de producție</li>
              <li>Coroziune prematură datorită lipsei lacului de protecție</li>
            </ul>

            <h3 className="text-xl font-bold mb-3 text-dark-800">Nu sunt acoperite de garanție:</h3>
            <ul className="list-disc ml-6 text-dark-700 space-y-2 mb-6">
              <li>Uzura normală datorită vârstei și utilizării</li>
              <li>Deteriorări datorite manipulării necorespunzătoare</li>
              <li>Instalația necorespunzătoare sau lipsa de întreținere</li>
              <li>Deteriorări datorite vânturilor puternice, cutremurelor, inundațiilor</li>
              <li>Daunele cauzate de accidente sau forță majoră</li>
            </ul>

            <h3 className="text-xl font-bold mb-3 text-dark-800">Cum să reclamați garanție:</h3>
            <p className="text-dark-700">
              Contactați furnizorul la office@exprestrading.com cu dovezi fotografice și detalii. Vom evalua cererea și, dacă este valabilă, vom oferi înlocuire sau reparație.
            </p>
          </section>

          {/* 9. Conformitate și Defecte */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">9. Conformitate și Garantia Legală de Calitate</h2>
            <p className="text-dark-700 mb-4">
              Conform legislației românești (Legea nr. 449/2001), produsele sunt garantate în termen de <strong>2 ani</strong> de la cumpărare pentru orice neconformități evidente.
            </p>
            <ul className="list-disc ml-6 text-dark-700 space-y-2">
              <li>Dvs. puteți cere repararea produsului în termen de 2 ani</li>
              <li>Dacă reparația nu este posibilă, puteți cere înlocuirea</li>
              <li>Dacă defectul este fundamental, puteți cere reducerea prețului sau rezilierea contractului</li>
              <li>Contactați-ne cu dovezi ale defectului pentru a deschide o reclamație</li>
            </ul>
          </section>

          {/* 10. Proprietate Intelectuală */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">10. Proprietate Intelectuală</h2>
            <p className="text-dark-700 mb-4">
              Toate conținuturile site-ului (text, imagini, logo, design) sunt proprietatea exclusivă a Esipca Metalica și sunt protejate de legile de copyright.
            </p>
            <ul className="list-disc ml-6 text-dark-700 space-y-2">
              <li>Nu aveți permisiunea de a reproduce, distribui sau modifica conținuturile</li>
              <li>Puteți utiliza conținuturile doar pentru uz personal și ne-comercial</li>
              <li>Utilizarea neautorizată va fi urmărită conform legii</li>
            </ul>
          </section>

          {/* 11. Limitări de Răspundere */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">11. Limitări de Răspundere</h2>
            <p className="text-dark-700 mb-4">
              În limita legii, Furnizorul nu este responsabil pentru:
            </p>
            <ul className="list-disc ml-6 text-dark-700 space-y-2">
              <li>Daunele indirecte sau consecutive rezultate din utilizarea site-ului</li>
              <li>Pierderea de venit, profit sau date</li>
              <li>Întreruperile în serviciu datorite defecțiunilor tehnice</li>
              <li>Accesul neautorizat la datele dvs. (în afara controlului nostru)</li>
            </ul>
            <p className="text-dark-700 mt-4">
              Răspunderea totală a Furnizorului pentru oricare daună nu va depăși suma plătită în comandă.
            </p>
          </section>

          {/* 12. Protecția Datelor */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">12. Protecția Datelor Personale</h2>
            <p className="text-dark-700 mb-4">
              Colectăm și prelucrăm datele dumneavoastră personale conform GDPR. Pentru informații detaliate, consultați:
            </p>
            <div className="bg-primary-50 p-4 rounded">
              <a href="/privacy" className="text-primary-600 hover:text-primary-700 font-semibold">
                Politica noastră de Confidențialitate →
              </a>
            </div>
          </section>

          {/* 13. Soluționarea Litigiilor */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">13. Soluționarea Litigiilor</h2>
            <p className="text-dark-700 mb-4">
              <strong>Prima opțiune:</strong> Încercăm rezolvarea amiabilă a oricăror litigii prin negociere directă. Contactați-ne la office@exprestrading.com.
            </p>
            <p className="text-dark-700 mb-4">
              <strong>Legea aplicabilă:</strong> Acești termeni și condiții sunt reglementați de legile României și UE.
            </p>
            <p className="text-dark-700 mb-4">
              <strong>Jurisdicția:</strong> Orice litigiu va fi soluționat de instanțele competente din Galați, România.
            </p>
            <p className="text-dark-700 mb-4">
              <strong>Alternativa online (ODR):</strong> Puteți depune o reclamație pe platforma Online Dispute Resolution a UE:
            </p>
            <div className="bg-dark-50 p-4 rounded mb-6">
              <p className="text-dark-700 text-sm">
                <strong>Platforma ODR:</strong> <a href="https://ec.europa.eu/consumers/odr/" className="text-primary-600">https://ec.europa.eu/consumers/odr/</a>
              </p>
            </div>

            <h3 className="text-xl font-bold mb-3 text-dark-800">ANPC și Arbitraj:</h3>
            <p className="text-dark-700">
              Puteți depune o reclamație la Autoritatea Națională pentru Protecția Consumatorilor (ANPC) pentru încălcarea drepturilor consumatorului.
            </p>
          </section>

          {/* 14. Forță Majoră */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">14. Forță Majoră</h2>
            <p className="text-dark-700 mb-4">
              Furnizorul nu este responsabil pentru:
            </p>
            <ul className="list-disc ml-6 text-dark-700 space-y-2">
              <li>Dezastre naturale (cutremure, inundații, furtuni)</li>
              <li>Crize de sănătate publică (pandemii, epidemii)</li>
              <li>Conflicte sau acte de război</li>
              <li>Întreruperi în serviciile de utilitate publică</li>
              <li>Întreruperile de internet sau tehnologia</li>
            </ul>
            <p className="text-dark-700 mt-4">
              În aceste cazuri, Furnizorul va comunica întârzierile și va lua măsuri rezonabile pentru a rezolva situația.
            </p>
          </section>

          {/* 15. Modificări Termeni */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">15. Modificări ale Termenilor și Condițiilor</h2>
            <p className="text-dark-700">
              Furnizorul se rezervă dreptul de a modifica acești termeni oricând. Modificările vor fi publicate pe site-ul nostru cu o nouă dată de "Ultima actualizare". Utilizarea continuă a site-ului după publicarea unor modificări constituie acceptarea acestora.
            </p>
          </section>

          {/* 16. Contact */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">16. Contact și Suport</h2>
            <p className="text-dark-700 mb-4">
              Pentru orice întrebări, reclamații sau sesizări privind acești termeni:
            </p>
            <div className="bg-primary-50 p-6 rounded-lg mb-6">
              <p className="text-dark-800 font-semibold mb-3">SC ROMEXPRES TRADING SRL</p>
              <p className="text-dark-700 mb-2">CUI: <strong>RO31361919</strong></p>
              <p className="text-dark-700 mb-2">Înmatriculare: <strong>J17/307/2013</strong></p>
              <p className="text-dark-700 mb-2">Email: <strong>office@exprestrading.com</strong></p>
              <p className="text-dark-700 mb-2">Telefon: <strong>+40 (722) 292 519</strong></p>
              <p className="text-dark-700">Adresă: <strong>Galaţi, Nicolae Gamulea 12, România</strong></p>
            </div>

            <h3 className="text-xl font-bold mb-3 text-dark-800">Autorități competente:</h3>
            <div className="bg-dark-50 p-6 rounded-lg">
              <p className="text-dark-800 font-semibold mb-3">ANPC (Protecția Consumatorului)</p>
              <p className="text-dark-700 mb-2">Website: <strong>www.anpc.ro</strong></p>
              <p className="text-dark-700">Email: <strong>protectia.consumatorilor@anpc.ro</strong></p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="bg-accent-50 p-6 rounded-lg border-l-4 border-accent-500 mt-12">
            <h3 className="text-lg font-bold mb-3 text-dark-900">⚠️ Disclaimer Legal</h3>
            <p className="text-dark-700 text-sm">
              Acești termeni și condiții sunt furnizați pentru informații generale și nu constituie consultanță juridică. Deși am încercat să cuprindem toate aspectele legale relevante conform legislației române și UE, pentru situații specifice sau preocupări legale complexe, vă recomandăm să consultați cu un avocat specializat în dreptul consumatorului și comerțul electronic.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

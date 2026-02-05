export const metadata = {
  title: 'Politica de Confidențialitate | Esipca Metalica',
  description: 'Politica de confidențialitate și protecția datelor personale. Aflați cum colectăm, utilizăm și protejăm datele dumneavoastră.',
}

export default function PrivacyPage() {
  return (
    <main>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container-max">
          <h1 className="text-4xl font-bold mb-2">Politica de Confidențialitate</h1>
          <p className="text-primary-100">Protecția datelor dumneavoastră este prioritatea noastră</p>
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
              Această politică se aplică pentru site-ul www.esipcametalica.ro și serviciile asociate.
            </p>
          </div>

          {/* 1. Introducere */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">1. Introducere</h2>
            <p className="text-dark-700 mb-4">
              Esipca Metalica (denumit în continuare "noi", "compania", "furnizor") se angajează să protejeze și să respecte confidențialitatea datelor dumneavoastră. Această Politică de Confidențialitate explică cum colectăm, utilizăm, divulgăm și protejez informațiile dumneavoastră.
            </p>
            <p className="text-dark-700">
              <strong>Date de contact ale furnizorului:</strong>
            </p>
            <ul className="text-dark-700 ml-6 mb-4">
              <li>Nume: SC ROMEXPRES TRADING SRL</li>
              <li>CUI: RO31361919</li>
              <li>Înmatriculare: J17/307/2013</li>
              <li>Adresă: Galaţi, Nicolae Gamulea 12, România</li>
              <li>Email: clienti@metalfence.ro</li>
              <li>Telefon: +40 (722) 292 519</li>
            </ul>
          </section>

          {/* 2. Date Colectate */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">2. Ce Date Colectăm</h2>
            <p className="text-dark-700 mb-4">Colectăm și prelucrăm următoarele categorii de date personale:</p>

            <h3 className="text-xl font-bold mb-3 text-dark-800">Informații pe care le furnizați direct:</h3>
            <ul className="list-disc ml-6 text-dark-700 mb-6 space-y-2">
              <li><strong>Formular de contact:</strong> Nume, email, telefon, mesaj</li>
              <li><strong>Abonament newsletter:</strong> Email, preferințe de comunicare</li>
              <li><strong>Comenzi online:</strong> Nume, adresă de livrare, email, telefon, informații plată</li>
              <li><strong>Autentificare admin:</strong> Email, parolă criptată</li>
            </ul>

            <h3 className="text-xl font-bold mb-3 text-dark-800">Informații colectate automat:</h3>
            <ul className="list-disc ml-6 text-dark-700 space-y-2">
              <li><strong>Datele de jurnal (log):</strong> Adresă IP, tip browser, sistem de operare, pagini vizitate, ora și data accesului</li>
              <li><strong>Cookies și tehnologii similare:</strong> Identificatori unici, preferințe utilizator</li>
              <li><strong>Datele Google Analytics:</strong> Comportament utilizator, origine trafic, timp petrecut pe site</li>
            </ul>
          </section>

          {/* 3. Scopul Prelucrării */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">3. Scopul Prelucrării Datelor</h2>
            <p className="text-dark-700 mb-4">Vă prelucrăm datele pentru următoarele scopuri:</p>
            <ul className="list-disc ml-6 text-dark-700 space-y-2">
              <li>Procesarea și executarea comenzilor dvs.</li>
              <li>Livrarea produselor și prestarea serviciilor</li>
              <li>Suport clienți și răspunsuri la întrebări</li>
              <li>Comunicări de marketing (doar cu consimțământul dvs.)</li>
              <li>Conformitate cu obligațiile legale și contractuale</li>
              <li>Prevenirea fraudei și asigurarea securității</li>
              <li>Îmbunătățirea site-ului și serviciilor noastre</li>
              <li>Analiza comportamentului utilizatorilor (Google Analytics)</li>
            </ul>
          </section>

          {/* 4. Baza Legală GDPR */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">4. Baza Legală a Prelucrării (GDPR)</h2>
            <p className="text-dark-700 mb-4">Prelucrăm datele dumneavoastră pe baza următoarelor baze legale conform GDPR:</p>
            <ul className="list-disc ml-6 text-dark-700 space-y-2">
              <li><strong>Executarea contractului:</strong> Procesare comenzi, livrare</li>
              <li><strong>Interes legitim:</strong> Îmbunătățire servicii, preveniție fraud</li>
              <li><strong>Obligație legală:</strong> Conformitate cu legile aplicabile</li>
              <li><strong>Consimțământ explicit:</strong> Newsletter, marketing, cookies analitice</li>
            </ul>
          </section>

          {/* 5. Partajarea Datelor */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">5. Cu Cine Partajăm Datele</h2>
            <p className="text-dark-700 mb-4">Vă datele pot fi partajate cu:</p>
            <ul className="list-disc ml-6 text-dark-700 space-y-2">
              <li><strong>Procesatori de plăți:</strong> Stripe, PayPal (pentru prelucrare plăți online)</li>
              <li><strong>Furnizori email marketing:</strong> MailChimp, SendGrid sau servicii similare</li>
              <li><strong>Companii de transport/curierat:</strong> Pentru livrare comenzi</li>
              <li><strong>Google Analytics:</strong> Pentru analiză trafic site</li>
              <li><strong>Autorități legale:</strong> Dacă este necesar conform legii</li>
            </ul>
            <p className="text-dark-700 mt-4 bg-dark-50 p-4 rounded">
              <strong>Important:</strong> Nu vindem, nu inchiriez și nu partajez datele dumneavoastră cu terți în scopuri de marketing direct fără consimțământul explicit.
            </p>
          </section>

          {/* 6. Cookie-uri */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">6. Cookie-uri și Tehnologii Similare</h2>
            <p className="text-dark-700 mb-4">Site-ul nostru utilizează cookies și tehnologii similare:</p>

            <h3 className="text-xl font-bold mb-3 text-dark-800">Tipuri de cookies:</h3>
            <ul className="list-disc ml-6 text-dark-700 space-y-2 mb-6">
              <li><strong>Cookies esențiale:</strong> Funcționare coș de cumpărături, autentificare, securitate</li>
              <li><strong>Cookies analitice:</strong> Google Analytics - pentru înțelegere utilizare site</li>
              <li><strong>Cookies de preferință:</strong> Stocarea preferințelor dumneavoastră</li>
            </ul>

            <h3 className="text-xl font-bold mb-3 text-dark-800">Gestionarea cookies-urilor:</h3>
            <p className="text-dark-700">
              Puteți refuza sau șterge cookies-urile prin setările browserului dumneavoastră. Rețineți că dezactivarea anumitor cookies poate afecta funcționarea site-ului.
            </p>
          </section>

          {/* 7. Securitatea Datelor */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">7. Securitatea Datelor</h2>
            <p className="text-dark-700 mb-4">Implementăm măsuri de securitate tehnice și organizatorice pentru protecția datelor:</p>
            <ul className="list-disc ml-6 text-dark-700 space-y-2">
              <li>Criptare HTTPS/SSL pentru toate transmisiile de date</li>
              <li>Parolele sunt criptate utilizând algoritmi moderni (bcryptjs)</li>
              <li>Acces restricționat la datele personale (numai angajații autorizați)</li>
              <li>Procesare securizată a plăților prin procesatori certificați PCI DSS</li>
              <li>Monitorizare și actualizare regulară a sistemelor de securitate</li>
            </ul>
            <p className="text-dark-700 mt-4 bg-dark-50 p-4 rounded">
              <strong>Notă:</strong> Nicio metodă de transmisie pe internet nu este 100% sigură. Deși facem tot posibilul, nu putem garanta securitate absolută.
            </p>
          </section>

          {/* 8. Drepturile GDPR ale Utilizatorilor */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">8. Drepturile Dumneavoastră conform GDPR</h2>
            <p className="text-dark-700 mb-4">Aveți următoarele drepturi privind datele dumneavoastră:</p>

            <ul className="list-disc ml-6 text-dark-700 space-y-2">
              <li><strong>Dreptul de acces:</strong> Să obțineți copie a datelor personale pe care le avem</li>
              <li><strong>Dreptul de rectificare:</strong> Să corectați datele inexacte</li>
              <li><strong>Dreptul la ștergere:</strong> Să cereti ștergerea datelor ("dreptul de a fi uitat")</li>
              <li><strong>Dreptul la limitarea prelucrării:</strong> Să restricționați cum utilizez datele</li>
              <li><strong>Dreptul la portabilitate:</strong> Să primiți datele într-un format structurat</li>
              <li><strong>Dreptul de opoziție:</strong> Să vă opuneți prelucrării datelor</li>
              <li><strong>Retragerea consimțământului:</strong> Pentru opțiuni bazate pe consimțământ</li>
            </ul>

            <h3 className="text-xl font-bold mb-3 mt-6 text-dark-800">Cum să vă exercitați drepturile:</h3>
            <p className="text-dark-700">
              Pentru a exercita orice dintre aceste drepturi, contactați-ne la <strong>clienti@metalfence.ro</strong> sau <strong>+40 (722) 292 519</strong>.
              Vă vom răspunde în termen de 30 de zile conform GDPR.
            </p>
          </section>

          {/* 9. Păstrarea Datelor */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">9. Período de Păstrare a Datelor</h2>
            <p className="text-dark-700 mb-4">Păstrăm datele dumneavoastră pentru perioada necesară:</p>
            <ul className="list-disc ml-6 text-dark-700 space-y-2">
              <li><strong>Date comenzi:</strong> 5 ani (obligație legală în România)</li>
              <li><strong>Date contactare:</strong> 1 an după ultimul contact</li>
              <li><strong>Newsletter:</strong> Până la retragerea consimțământului</li>
              <li><strong>Cookies analitice:</strong> Conform setărilor Google Analytics</li>
              <li><strong>Date autentificare:</strong> Cât timp contul rămâne activ</li>
            </ul>
          </section>

          {/* 10. Transfer Internațional */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">10. Transfer de Datelor Internațional</h2>
            <p className="text-dark-700 mb-4">
              Unii dintre furnizorii noștri (Google Analytics, Stripe, PayPal) pot fi localizați în Statele Unite sau alte țări. Pentru aceste transferuri, utilizăm mecanisme de protecție conform GDPR (clauze contractuale standard sau alte safeguards).
            </p>
            <p className="text-dark-700">
              Transferurile se efectuează conform Deciziei Comisiei Europene privind adecvare protecție date.
            </p>
          </section>

          {/* 11. Contact - Responsabil Protecție Datelor */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">11. Contact și Reclamații</h2>
            <p className="text-dark-700 mb-4">
              Pentru orice întrebări privind confidențialitatea datelor dvs., vă rugăm să contactați:
            </p>
            <div className="bg-primary-50 p-6 rounded-lg mb-6">
              <p className="text-dark-800 font-semibold mb-3">SC ROMEXPRES TRADING SRL</p>
              <p className="text-dark-700 mb-2">CUI: <strong>RO31361919</strong></p>
              <p className="text-dark-700 mb-2">Email: <strong>clienti@metalfence.ro</strong></p>
              <p className="text-dark-700 mb-2">Telefon: <strong>+40 (722) 292 519</strong></p>
              <p className="text-dark-700">Adresă: <strong>Galaţi, Nicolae Gamulea 12, România</strong></p>
            </div>

            <p className="text-dark-700 mb-4">
              Dacă nu sunteți mulțumit de răspunsul nostru, aveți dreptul să depuneți o reclamație la:
            </p>
            <div className="bg-dark-50 p-6 rounded-lg">
              <p className="text-dark-800 font-semibold mb-3">Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP)</p>
              <p className="text-dark-700 mb-2">Email: <strong>anspdcp@dataprotection.ro</strong></p>
              <p className="text-dark-700 mb-2">Website: <strong>www.dataprotection.ro</strong></p>
              <p className="text-dark-700">Telefon: <strong>+40 (372) 700 348</strong></p>
            </div>
          </section>

          {/* 12. Modificări */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">12. Modificări ale Politicii</h2>
            <p className="text-dark-700">
              Putem actualiza această Politică de Confidențialitate din timp în timp. Vă vom notifica despre modificări semnificative prin email la adresa dvs. de contact sau prin publicare pe site-ul nostru.
              Continuarea utilizării site-ului după publicarea unor modificări constituie acceptarea acestora.
            </p>
          </section>

          {/* 13. Contact ANPC */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-dark-900">13. Protecția Consumatorului</h2>
            <p className="text-dark-700 mb-4">
              Pentru plângeri privind protecția consumatorului și drepturile consumatorilor, puteți contacta:
            </p>
            <div className="bg-dark-50 p-6 rounded-lg">
              <p className="text-dark-800 font-semibold mb-3">Autoritatea Națională pentru Protecția Consumatorilor (ANPC)</p>
              <p className="text-dark-700 mb-2">Website: <strong>www.anpc.ro</strong></p>
              <p className="text-dark-700">Email: <strong>protectia.consumatorilor@anpc.ro</strong></p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="bg-accent-50 p-6 rounded-lg border-l-4 border-accent-500">
            <h3 className="text-lg font-bold mb-3 text-dark-900">⚠️ Disclaimer Legal</h3>
            <p className="text-dark-700 text-sm">
              Această Politică de Confidențialitate este furnizată pentru informații generale. Nu constituie consultanță juridică. Pentru situații specifice sau preocupări legale, vă recomandăm să consultați cu un avocat specializat în protecția datelor și dreptul consumatorului.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

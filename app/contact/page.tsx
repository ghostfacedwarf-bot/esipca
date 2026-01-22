'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Send, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showMapDialog, setShowMapDialog] = useState(false)

  // Coordonate Galati, DN26
  const latitude = 45.487455
  const longitude = 28.033010
  const address = "Sipca Metalica si Tigla Metalica Galati, DN26, Galați 800012"

  const openMapApp = (app: 'google' | 'apple' | 'waze') => {
    if (app === 'google') {
      window.open(`https://maps.google.com/?q=${latitude},${longitude}`, '_blank')
    } else if (app === 'apple') {
      window.open(`maps://maps.apple.com/?q=${address}&ll=${latitude},${longitude}`, '_blank')
    } else if (app === 'waze') {
      window.open(`https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`, '_blank')
    }
    setShowMapDialog(false)
  }

  const handleMapClick = () => {
    // Detecteaza daca e mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) {
      setShowMapDialog(true)
    } else {
      // Pe desktop, deschide Google Maps direct
      window.open(`https://maps.google.com/?q=${latitude},${longitude}`, '_blank')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success('Mesajul tău a fost trimis cu succes!')
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
      } else {
        toast.error('A apărut o eroare. Te rog încearcă din nou.')
      }
    } catch (error) {
      toast.error('A apărut o eroare. Te rog încearcă din nou.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <main>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-12">
        <div className="container-max">
          <h1 className="text-4xl font-bold mb-2">Contact</h1>
          <p className="text-primary-100">
            Suntem aici să te ajutăm cu orice întrebare
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-max py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Contact Info Card 1 */}
          <div className="bg-white p-8 rounded-lg border border-dark-100 text-center hover:shadow-lg transition-shadow">
            <Phone className="text-primary-600 mx-auto mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Telefon</h3>
            <p className="text-dark-600 mb-4">Luni - Vineri: 9:00 - 17:00</p>
            <a href="tel:+40722292519" className="text-primary-600 font-semibold hover:text-primary-700">
              +40 (722) 292 519
            </a>
          </div>

          {/* Contact Info Card 2 */}
          <div className="bg-white p-8 rounded-lg border border-dark-100 text-center hover:shadow-lg transition-shadow">
            <Mail className="text-accent-500 mx-auto mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <p className="text-dark-600 mb-4">Răspunsuri în 24 de ore</p>
            <a href="mailto:office@exprestrading.com" className="text-accent-600 font-semibold hover:text-accent-700">
              office@exprestrading.com
            </a>
          </div>

          {/* Contact Info Card 3 */}
          <div className="bg-white p-8 rounded-lg border border-dark-100 text-center hover:shadow-lg transition-shadow">
            <MapPin className="text-blue-600 mx-auto mb-4" size={40} />
            <h3 className="text-xl font-bold mb-2">Birou</h3>
            <p className="text-dark-600">
              DN26, Galați<br />
              România, 800012
            </p>
          </div>
        </div>

        {/* Map Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Locația Noastră</h2>
          <div
            onClick={handleMapClick}
            className="cursor-pointer rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <iframe
              width="100%"
              height="400"
              frameBorder="0"
              src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            ></iframe>
          </div>
          <p className="text-dark-600 text-center mt-4">
            Clic pe hartă pentru a o deschide în aplicația de hărți preferată
          </p>
        </div>

        {/* Form Section */}
        <div className="mb-12 flex justify-center">
          {/* Form */}
          <div className="w-full max-w-2xl">
            <h2 className="text-3xl font-bold mb-8 text-center">Trimite-ne un Mesaj</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label htmlFor="name">Nume *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Introdu-ți numele"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="tău@exemplu.ro"
                  />
                </div>

                <div className="form-control">
                  <label htmlFor="phone">Telefon *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+40 (xxx) xxx xxx"
                  />
                </div>
              </div>

              <div className="form-control">
                <label htmlFor="subject">Tip Cerere *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-dark-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                >
                  <option value="">Alege o opțiune...</option>
                  <option value="Cerere de Ofertă">Cerere de Ofertă / Cotație</option>
                  <option value="Comandă">Comandă Urgentă</option>
                  <option value="Probleme cu Produsul">Probleme / Reclamație</option>
                  <option value="Consultanță">Consultanță Tehnică</option>
                  <option value="Parteneriat">Interes de Parteneriat</option>
                  <option value="Altele">Altele</option>
                </select>
              </div>

              <div className="form-control">
                <label htmlFor="message">Detalii Cererii *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Descrie cererea ta în detaliu (produse, cantități, deadline, etc.)..."
                  rows={6}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary btn-lg flex items-center justify-center gap-2"
              >
                <Send size={20} />
                {isLoading ? 'Se trimite...' : 'Trimite Cererea'}
              </button>

              <p className="text-sm text-dark-500 text-center">
                Respectăm privacitatea ta. Datele tale nu vor fi partajate cu terțe părți.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-16 bg-dark-50">
        <div className="container-max max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Întrebări Frecvente</h2>
          <div className="space-y-4">
            <details className="bg-white p-6 rounded-lg border border-dark-100 cursor-pointer group">
              <summary className="font-bold text-dark-900 flex justify-between items-center">
                <span>Care este termenul de livrare?</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-dark-600 mt-4">
                Standard livrez în 1-7 zile lucrătoare în funcție de disponibilitate. Pentru comenzi personalizate, termenul poate fi mai lung.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-dark-100 cursor-pointer group">
              <summary className="font-bold text-dark-900 flex justify-between items-center">
                <span>Oferiți consulan profesională?</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-dark-600 mt-4">
                Da! Echipa noastră de specialisti este disponibilă pentru a te ajuta cu alegerea produselor potrivite și planing proiectului.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-dark-100 cursor-pointer group">
              <summary className="font-bold text-dark-900 flex justify-between items-center">
                <span>Ce garanție oferiți?</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-dark-600 mt-4">
                Oferim garanție de 30 ani pentru toate produsele metalice. Aceasta acoperă defecte de fabricație și durabilitate.
              </p>
            </details>

            <details className="bg-white p-6 rounded-lg border border-dark-100 cursor-pointer group">
              <summary className="font-bold text-dark-900 flex justify-between items-center">
                <span>Cum funcționează plata?</span>
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-dark-600 mt-4">
                Acceptăm plată prin ramburs (la livrare), transfer bancar și alte metode convenite cu clientul.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Map App Selection Dialog */}
      {showMapDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-dark-900">Deschide Harta</h3>
              <button
                onClick={() => setShowMapDialog(false)}
                className="text-dark-500 hover:text-dark-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-dark-600 mb-6">
              Alege aplicația în care vrei să deschizi harta:
            </p>
            <div className="space-y-3">
              <button
                onClick={() => openMapApp('google')}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <MapPin size={20} />
                Google Maps
              </button>
              <button
                onClick={() => openMapApp('apple')}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <MapPin size={20} />
                Apple Maps
              </button>
              <button
                onClick={() => openMapApp('waze')}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <MapPin size={20} />
                Waze
              </button>
            </div>
            <button
              onClick={() => setShowMapDialog(false)}
              className="w-full mt-4 px-4 py-2 border border-dark-200 text-dark-700 rounded-lg font-semibold hover:bg-dark-50 transition-colors"
            >
              Anulare
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

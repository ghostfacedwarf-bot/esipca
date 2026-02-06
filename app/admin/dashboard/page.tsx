'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle, Package, LogOut, Settings, LayoutDashboard, ShoppingCart, Users, BarChart3, Mail, Star } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
                <p className="text-sm text-slate-500">Esipca Metalica</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Ieșire</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-lg font-semibold text-slate-700 mb-6">Secțiuni disponibile</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Chat */}
          <Link
            href="/admin/chat"
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:border-amber-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                <MessageCircle className="w-6 h-6 text-amber-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">
                  Live Chat
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Gestionează conversațiile cu vizitatorii
                </p>
              </div>
            </div>
          </Link>

          {/* Products */}
          <Link
            href="/admin/products"
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <Package className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                  Produse
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Editează prețuri și descrieri produse
                </p>
              </div>
            </div>
          </Link>

          {/* Newsletter */}
          <Link
            href="/admin/newsletter"
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:border-emerald-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                <Mail className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
                  Newsletter
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Gestioneaza abonati si trimite newsletter
                </p>
              </div>
            </div>
          </Link>

          {/* Orders */}
          <Link
            href="/admin/orders"
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:border-green-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors">
                <ShoppingCart className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-green-600 transition-colors">
                  Comenzi
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Gestionează comenzile clienților
                </p>
              </div>
            </div>
          </Link>

          {/* Reviews */}
          <Link
            href="/admin/reviews"
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:border-orange-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                <Star className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-orange-600 transition-colors">
                  Recenzii
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Gestioneaza recenziile clientilor
                </p>
              </div>
            </div>
          </Link>

          {/* Users - Coming Soon */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 opacity-60 cursor-not-allowed">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Utilizatori
                  <span className="ml-2 text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">În curând</span>
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Gestionează conturile admin
                </p>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <Link
            href="/admin/stats"
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:border-indigo-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                <BarChart3 className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  Statistici
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Vizualizează rapoarte și analize
                </p>
              </div>
            </div>
          </Link>

          {/* Settings - Coming Soon */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 opacity-60 cursor-not-allowed">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Setări
                  <span className="ml-2 text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">În curând</span>
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Configurează opțiuni generale
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

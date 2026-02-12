'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Package, Edit2, Save, X, LogOut, RefreshCw, ChevronLeft,
  Image as ImageIcon, Tag, FileText, Settings, Star, Eye, EyeOff,
  Plus, Trash2, Upload, Loader2
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface Variant {
  id: string
  sku: string
  price: number
  priceEU: number | null
  attributes: any
  stockStatus: string
}

interface Media {
  id: string
  url: string
  alt: string | null
  sortOrder: number
}

interface Product {
  id: string
  name: string
  slug: string
  shortDescription: string | null
  longDescription: string | null
  priceFrom: number
  discountPercent: number
  priceType: string
  specs: Record<string, any> | null
  isFeatured: boolean
  isBestseller: boolean
  isActive: boolean
  variants: Variant[]
  media?: Media[]
  category: {
    id: string
    name: string
  }
}

interface EditData {
  name: string
  slug: string
  shortDescription: string
  longDescription: string
  priceFrom: number
  discountPercent: number
  priceType: string
  specs: Record<string, any>
  isFeatured: boolean
  isBestseller: boolean
  isActive: boolean
}

type TabType = 'general' | 'price' | 'specs' | 'media' | 'status'

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editData, setEditData] = useState<EditData | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('general')
  const [isSaving, setIsSaving] = useState(false)
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecValue, setNewSpecValue] = useState('')
  const [bulkDiscount, setBulkDiscount] = useState('')
  const [isApplyingBulk, setIsApplyingBulk] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const fetchProducts = async (refreshEditingId?: string) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      if (data.products) {
        setProducts(data.products)
        // Refresh the editing product with new data (e.g. after media upload)
        if (refreshEditingId) {
          const updated = data.products.find((p: Product) => p.id === refreshEditingId)
          if (updated) setEditingProduct(updated)
        }
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const openEditor = (product: Product) => {
    setEditingProduct(product)
    setEditData({
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription || '',
      longDescription: product.longDescription || '',
      priceFrom: product.priceFrom,
      discountPercent: product.discountPercent || 0,
      priceType: product.priceType,
      specs: product.specs || {},
      isFeatured: product.isFeatured,
      isBestseller: product.isBestseller,
      isActive: product.isActive,
    })
    setActiveTab('general')
  }

  const closeEditor = () => {
    setEditingProduct(null)
    setEditData(null)
  }

  const saveProduct = async () => {
    if (!editingProduct || !editData) return

    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: editingProduct.id,
          name: editData.name,
          slug: editData.slug,
          shortDescription: editData.shortDescription,
          longDescription: editData.longDescription,
          variantPrice: editData.priceFrom,
          discountPercent: editData.discountPercent,
          priceType: editData.priceType,
          specs: editData.specs,
          isFeatured: editData.isFeatured,
          isBestseller: editData.isBestseller,
          isActive: editData.isActive,
        }),
      })

      if (res.ok) {
        await fetchProducts()
        closeEditor()
      } else {
        alert('Eroare la salvare')
      }
    } catch (error) {
      console.error('Save error:', error)
      alert('Eroare la salvare')
    } finally {
      setIsSaving(false)
    }
  }

  const addSpec = () => {
    if (!editData || !newSpecKey.trim()) return
    setEditData({
      ...editData,
      specs: { ...editData.specs, [newSpecKey]: newSpecValue }
    })
    setNewSpecKey('')
    setNewSpecValue('')
  }

  const removeSpec = (key: string) => {
    if (!editData) return
    const newSpecs = { ...editData.specs }
    delete newSpecs[key]
    setEditData({ ...editData, specs: newSpecs })
  }

  const updateSpec = (key: string, value: string) => {
    if (!editData) return
    setEditData({
      ...editData,
      specs: { ...editData.specs, [key]: value }
    })
  }

  const applyBulkDiscount = async () => {
    const discount = parseFloat(bulkDiscount)
    if (isNaN(discount) || discount < 0 || discount > 100) {
      alert('Introduceți o reducere validă (0-100%)')
      return
    }

    if (!confirm(`Sigur vrei să aplici ${discount}% reducere la TOATE produsele?`)) {
      return
    }

    setIsApplyingBulk(true)
    try {
      const res = await fetch('/api/admin/products/bulk-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discountPercent: discount }),
      })

      if (res.ok) {
        const data = await res.json()
        alert(`Reducere de ${discount}% aplicată la ${data.updatedCount} produse!`)
        await fetchProducts()
        setBulkDiscount('')
      } else {
        alert('Eroare la aplicarea reducerii')
      }
    } catch (error) {
      console.error('Bulk discount error:', error)
      alert('Eroare la aplicarea reducerii')
    } finally {
      setIsApplyingBulk(false)
    }
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <FileText size={16} /> },
    { id: 'price', label: 'Prețuri', icon: <Tag size={16} /> },
    { id: 'specs', label: 'Specificații', icon: <Settings size={16} /> },
    { id: 'media', label: 'Media', icon: <ImageIcon size={16} /> },
    { id: 'status', label: 'Status', icon: <Star size={16} /> },
  ]

  return (
    <div className="h-screen bg-slate-100 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <div className="flex items-center gap-2">
                <Package className="w-6 h-6 text-blue-500" />
                <h1 className="text-lg font-bold text-slate-800">Produse</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Bulk Discount */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-sm text-amber-700 font-medium">Reducere toate:</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={bulkDiscount}
                  onChange={(e) => setBulkDiscount(e.target.value)}
                  placeholder="0"
                  className="w-16 px-2 py-1 text-sm border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-sm text-amber-600">%</span>
                <button
                  onClick={applyBulkDiscount}
                  disabled={isApplyingBulk || !bulkDiscount}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white text-sm font-medium rounded transition-colors"
                >
                  {isApplyingBulk ? '...' : 'Aplică'}
                </button>
              </div>
              <button
                onClick={() => fetchProducts()}
                className="p-2 text-slate-600 hover:text-amber-500 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Ieșire</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Produs</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">🇷🇴 România</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">🇪🇺 Europa</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Status</th>
                    <th className="text-right px-4 py-3 text-sm font-semibold text-slate-700">Acțiuni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {product.media && product.media[0] ? (
                            <div className="relative w-10 h-10">
                              <Image
                                src={product.media[0].url}
                                alt={product.name}
                                fill
                                sizes="40px"
                                className="rounded-lg object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center">
                              <Package className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-slate-800">{product.name}</div>
                            <div className="text-xs text-slate-400">{product.category.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          {product.discountPercent > 0 ? (
                            <>
                              <span className="font-semibold text-green-600">
                                {(product.priceFrom * (1 - product.discountPercent / 100)).toFixed(2)} RON
                              </span>
                              <span className="ml-2 text-xs text-slate-400 line-through">
                                {product.priceFrom.toFixed(2)}
                              </span>
                              <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
                                -{product.discountPercent}%
                              </span>
                            </>
                          ) : (
                            <span className="font-semibold text-slate-800">
                              {product.priceFrom.toFixed(2)} RON
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          {product.discountPercent > 0 ? (
                            <span className="text-green-600">
                              {(product.priceFrom * 2 * (1 - product.discountPercent / 100)).toFixed(2)} RON
                            </span>
                          ) : (
                            <span className="text-slate-600">
                              {(product.priceFrom * 2).toFixed(2)} RON
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                            product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {product.isActive ? 'Activ' : 'Inactiv'}
                          </span>
                          {product.isFeatured && (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                              Featured
                            </span>
                          )}
                          {product.isBestseller && (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                              Bestseller
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => openEditor(product)}
                          className="p-2 text-slate-600 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {products.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Niciun produs găsit</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Editor */}
      {editingProduct && editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Editare Produs</h2>
                <p className="text-sm text-slate-500">{editingProduct.name}</p>
              </div>
              <button
                onClick={closeEditor}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-6">
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nume Produs
                    </label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Slug (URL)
                    </label>
                    <input
                      type="text"
                      value={editData.slug}
                      onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Descriere Scurtă
                    </label>
                    <textarea
                      value={editData.shortDescription}
                      onChange={(e) => setEditData({ ...editData, shortDescription: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Descriere scurtă afișată în listing..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Descriere Completă
                    </label>
                    <textarea
                      value={editData.longDescription}
                      onChange={(e) => setEditData({ ...editData, longDescription: e.target.value })}
                      rows={6}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Descriere detaliată pentru pagina produsului..."
                    />
                  </div>
                </div>
              )}

              {/* Price Tab */}
              {activeTab === 'price' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-50 rounded-xl">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        🇷🇴 Preț Original România (RON)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.01"
                          value={editData.priceFrom}
                          onChange={(e) => setEditData({ ...editData, priceFrom: parseFloat(e.target.value) || 0 })}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg font-semibold"
                        />
                        <span className="text-slate-500 font-medium">RON</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        Prețul de bază înainte de reducere
                      </p>
                    </div>

                    <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
                      <label className="block text-sm font-medium text-red-700 mb-2">
                        🏷️ Reducere (%)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          value={editData.discountPercent}
                          onChange={(e) => setEditData({ ...editData, discountPercent: parseFloat(e.target.value) || 0 })}
                          className="flex-1 px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-lg font-semibold"
                        />
                        <span className="text-red-500 font-medium">%</span>
                      </div>
                      <p className="text-xs text-red-600 mt-2">
                        0 = fără reducere
                      </p>
                    </div>
                  </div>

                  {/* Calculated final prices */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                      <label className="block text-sm font-medium text-green-700 mb-2">
                        🇷🇴 Preț Final România
                      </label>
                      <div className="text-2xl font-bold text-green-600">
                        {(editData.priceFrom * (1 - editData.discountPercent / 100)).toFixed(2)} RON
                      </div>
                      {editData.discountPercent > 0 && (
                        <p className="text-xs text-green-600 mt-1">
                          Economie: {(editData.priceFrom * editData.discountPercent / 100).toFixed(2)} RON
                        </p>
                      )}
                    </div>

                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <label className="block text-sm font-medium text-blue-700 mb-2">
                        🇪🇺 Preț Final Europa (×2)
                      </label>
                      <div className="text-2xl font-bold text-blue-600">
                        {(editData.priceFrom * 2 * (1 - editData.discountPercent / 100)).toFixed(2)} RON
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tip Preț
                    </label>
                    <select
                      value={editData.priceType}
                      onChange={(e) => setEditData({ ...editData, priceType: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="per_piece">Per Bucată</option>
                      <option value="per_meter">Per Metru</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Specs Tab */}
              {activeTab === 'specs' && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSpecKey}
                      onChange={(e) => setNewSpecKey(e.target.value)}
                      placeholder="Nume specificație (ex: material)"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <input
                      type="text"
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                      placeholder="Valoare (ex: Oțel zincat)"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      onClick={addSpec}
                      disabled={!newSpecKey.trim()}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white rounded-lg transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    {Object.keys(editData.specs).length === 0 ? (
                      <div className="p-8 text-center text-slate-400">
                        <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Nicio specificație adăugată</p>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="text-left px-4 py-2 text-sm font-medium text-slate-700">Specificație</th>
                            <th className="text-left px-4 py-2 text-sm font-medium text-slate-700">Valoare</th>
                            <th className="w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {Object.entries(editData.specs).map(([key, value]) => (
                            <tr key={key}>
                              <td className="px-4 py-2 font-medium text-slate-700">{key}</td>
                              <td className="px-4 py-2">
                                <input
                                  type="text"
                                  value={String(value)}
                                  onChange={(e) => updateSpec(key, e.target.value)}
                                  className="w-full px-2 py-1 border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                              </td>
                              <td className="px-2 py-2">
                                <button
                                  onClick={() => removeSpec(key)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}

              {/* Media Tab */}
              {activeTab === 'media' && (
                <div className="space-y-4">
                  {/* Upload zone */}
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={async (e) => {
                        const files = e.target.files
                        if (!files || !editingProduct) return
                        setIsUploading(true)
                        const formData = new FormData()
                        formData.append('productId', editingProduct.id)
                        for (const file of Array.from(files)) {
                          formData.append('files', file)
                        }
                        try {
                          const res = await fetch('/api/admin/products/upload', {
                            method: 'POST',
                            body: formData,
                          })
                          const data = await res.json()
                          if (res.ok) {
                            toast.success(`${data.uploaded} imagine(i) incarcate`)
                            await fetchProducts(editingProduct.id)
                          } else {
                            toast.error(data.error || 'Eroare la upload')
                          }
                        } catch {
                          toast.error('Eroare la upload')
                        } finally {
                          setIsUploading(false)
                          e.target.value = ''
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      disabled={isUploading}
                    />
                    <div className={`p-8 border-2 border-dashed rounded-xl text-center transition-colors ${
                      isUploading ? 'border-amber-400 bg-amber-50' : 'border-slate-300 hover:border-amber-400 hover:bg-amber-50'
                    }`}>
                      {isUploading ? (
                        <>
                          <Loader2 className="w-12 h-12 mx-auto mb-3 text-amber-500 animate-spin" />
                          <p className="text-amber-600 font-medium">Se incarca...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                          <p className="text-slate-600 mb-2">Click sau trage imaginile aici</p>
                          <p className="text-sm text-slate-400">JPG, PNG, WebP - max 5MB per imagine</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Existing images grid */}
                  {editingProduct.media && editingProduct.media.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">
                        Imagini existente ({editingProduct.media.length})
                      </h4>
                      <div className="grid grid-cols-4 gap-3">
                        {editingProduct.media.map((m) => (
                          <div key={m.id} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200">
                            <Image
                              src={m.url}
                              alt={m.alt || ''}
                              fill
                              sizes="200px"
                              className="object-cover"
                            />
                            <button
                              onClick={async () => {
                                if (!confirm('Sigur vrei sa stergi aceasta imagine?')) return
                                try {
                                  const res = await fetch('/api/admin/products/upload', {
                                    method: 'DELETE',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ mediaId: m.id }),
                                  })
                                  if (res.ok) {
                                    toast.success('Imagine stearsa')
                                    await fetchProducts(editingProduct.id)
                                  }
                                } catch {
                                  toast.error('Eroare la stergere')
                                }
                              }}
                              className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                              title="Sterge imaginea"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 text-center">
                              #{m.sortOrder}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!editingProduct.media || editingProduct.media.length === 0) && (
                    <p className="text-sm text-slate-400 text-center py-4">
                      Nicio imagine. Incarca prima imagine mai sus.
                    </p>
                  )}
                </div>
              )}

              {/* Status Tab */}
              {activeTab === 'status' && (
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={editData.isActive}
                      onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
                      className="w-5 h-5 rounded text-green-500 focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {editData.isActive ? <Eye className="w-5 h-5 text-green-500" /> : <EyeOff className="w-5 h-5 text-slate-400" />}
                        <span className="font-medium text-slate-800">Produs Activ</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        Produsele inactive nu sunt afișate pe site
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={editData.isFeatured}
                      onChange={(e) => setEditData({ ...editData, isFeatured: e.target.checked })}
                      className="w-5 h-5 rounded text-amber-500 focus:ring-amber-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Star className={`w-5 h-5 ${editData.isFeatured ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                        <span className="font-medium text-slate-800">Produs Featured</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        Afișat în secțiunea "Produse Recomandate" pe homepage
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={editData.isBestseller}
                      onChange={(e) => setEditData({ ...editData, isBestseller: e.target.checked })}
                      className="w-5 h-5 rounded text-blue-500 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Tag className={`w-5 h-5 ${editData.isBestseller ? 'text-blue-500' : 'text-slate-400'}`} />
                        <span className="font-medium text-slate-800">Bestseller</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        Marcat cu badge "Bestseller" în listing
                      </p>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={closeEditor}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                Anulează
              </button>
              <button
                onClick={saveProduct}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-400 text-white font-medium rounded-lg transition-colors"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Se salvează...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Salvează
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

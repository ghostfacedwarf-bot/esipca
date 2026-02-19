'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Settings, ChevronLeft, LogOut, Loader2, Save, Building2,
  Mail, Globe, ShoppingCart,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface SettingsData {
  companyName: string
  companyAddress: string
  companyPhone: string
  companyEmail: string
  companyCUI: string
  companyJ: string
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPass: string
  emailFrom: string
  emailFromName: string
  siteTitle: string
  siteDescription: string
  metaKeywords: string
  freeShippingThreshold: number
  warrantyYears: number
  deliveryDays: string
  minOrderAmount: number
  shippingFee: number
  orderConfirmationMessage: string
}

const TABS = [
  { key: 'company', label: 'Info Companie', icon: Building2 },
  { key: 'email', label: 'Email/SMTP', icon: Mail },
  { key: 'site', label: 'Setari Site', icon: Globe },
  { key: 'orders', label: 'Setari Comenzi', icon: ShoppingCart },
] as const

type TabKey = (typeof TABS)[number]['key']

export default function AdminSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<SettingsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('company')

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      if (data.settings) {
        setSettings(data.settings)
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
      toast.error('Eroare la incarcarea setarilor')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSave = async () => {
    if (!settings) return
    setIsSaving(true)

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        const data = await res.json()
        setSettings(data.settings)
        toast.success('Setarile au fost salvate')
      } else {
        const data = await res.json()
        toast.error(data.message || 'Eroare la salvare')
      }
    } catch (err) {
      toast.error('Eroare de retea')
    } finally {
      setIsSaving(false)
    }
  }

  const updateField = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!settings) return null

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <div className="flex items-center gap-2">
                <Settings className="w-6 h-6 text-slate-500" />
                <h1 className="text-lg font-bold text-slate-800">Setari</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-lg transition-colors text-sm font-medium"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Salveaza
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Iesire</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 flex-wrap">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          {activeTab === 'company' && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Informatii Companie</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldInput label="Nume companie" value={settings.companyName} onChange={(v) => updateField('companyName', v)} />
                <FieldInput label="Telefon" value={settings.companyPhone} onChange={(v) => updateField('companyPhone', v)} />
                <FieldInput label="Email" value={settings.companyEmail} onChange={(v) => updateField('companyEmail', v)} type="email" />
                <FieldInput label="CUI" value={settings.companyCUI} onChange={(v) => updateField('companyCUI', v)} placeholder="RO12345678" />
                <FieldInput label="Nr. Reg. Com. (J)" value={settings.companyJ} onChange={(v) => updateField('companyJ', v)} placeholder="J17/123/2020" />
              </div>
              <FieldInput label="Adresa" value={settings.companyAddress} onChange={(v) => updateField('companyAddress', v)} />
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Configurare Email / SMTP</h2>
              <p className="text-sm text-slate-500 mb-4">
                Aceste setari sunt folosite pentru trimiterea email-urilor de confirmare comenzi si newsletter.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldInput label="SMTP Host" value={settings.smtpHost} onChange={(v) => updateField('smtpHost', v)} placeholder="smtp.hostinger.com" />
                <FieldInput label="SMTP Port" value={String(settings.smtpPort)} onChange={(v) => updateField('smtpPort', parseInt(v) || 465)} type="number" />
                <FieldInput label="SMTP User" value={settings.smtpUser} onChange={(v) => updateField('smtpUser', v)} placeholder="user@domain.ro" />
                <FieldInput label="SMTP Parola" value={settings.smtpPass} onChange={(v) => updateField('smtpPass', v)} type="password" />
                <FieldInput label="Email From" value={settings.emailFrom} onChange={(v) => updateField('emailFrom', v)} placeholder="noreply@domain.ro" />
                <FieldInput label="Email From Nume" value={settings.emailFromName} onChange={(v) => updateField('emailFromName', v)} placeholder="Esipca Metalica" />
              </div>
            </div>
          )}

          {activeTab === 'site' && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Setari Site</h2>
              <FieldInput label="Titlu site" value={settings.siteTitle} onChange={(v) => updateField('siteTitle', v)} />
              <FieldTextarea label="Descriere site" value={settings.siteDescription || ''} onChange={(v) => updateField('siteDescription', v)} placeholder="Descrierea care apare in motoarele de cautare..." rows={3} />
              <FieldTextarea label="Meta Keywords" value={settings.metaKeywords || ''} onChange={(v) => updateField('metaKeywords', v)} placeholder="sipca metalica, gard metalic, ..." rows={2} />
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Setari Comenzi</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FieldInput label="Comanda minima (RON)" value={String(settings.minOrderAmount)} onChange={(v) => updateField('minOrderAmount', parseFloat(v) || 0)} type="number" />
                <FieldInput label="Cost livrare (RON)" value={String(settings.shippingFee)} onChange={(v) => updateField('shippingFee', parseFloat(v) || 0)} type="number" />
                <FieldInput label="Livrare gratuita de la (RON)" value={String(settings.freeShippingThreshold)} onChange={(v) => updateField('freeShippingThreshold', parseFloat(v) || 0)} type="number" />
                <FieldInput label="Garantie (ani)" value={String(settings.warrantyYears)} onChange={(v) => updateField('warrantyYears', parseInt(v) || 0)} type="number" />
                <FieldInput label="Zile livrare" value={settings.deliveryDays} onChange={(v) => updateField('deliveryDays', v)} placeholder="1-7" />
              </div>
              <FieldTextarea
                label="Mesaj confirmare comanda"
                value={settings.orderConfirmationMessage || ''}
                onChange={(v) => updateField('orderConfirmationMessage', v)}
                placeholder="Mesaj personalizat afisat dupa plasarea comenzii..."
                rows={4}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FieldInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
      />
    </div>
  )
}

function FieldTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 resize-y"
      />
    </div>
  )
}

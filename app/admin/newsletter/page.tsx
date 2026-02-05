'use client'

import { useState, useEffect } from 'react'
import {
  Mail, ChevronLeft, LogOut, RefreshCw, Users, Send, Loader2,
  UserMinus, Eye, AlertTriangle, CheckCircle, XCircle, Palette,
  Image, Type, MousePointerClick, EyeOff, Settings2,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Subscriber {
  id: string
  email: string
  name: string | null
  isActive: boolean
  subscribedAt: string
  unsubscribedAt: string | null
}

interface DesignOptions {
  headerColor: string
  headerGradientEnd: string
  headerTitle: string
  showLogo: boolean
  bannerImageUrl: string
  ctaText: string
  ctaUrl: string
  ctaColor: string
}

const COLOR_PRESETS = [
  { name: 'Albastru', from: '#1e40af', to: '#3b82f6' },
  { name: 'Auriu', from: '#92400e', to: '#f59e0b' },
  { name: 'Verde', from: '#065f46', to: '#10b981' },
  { name: 'Rosu', from: '#991b1b', to: '#ef4444' },
  { name: 'Violet', from: '#5b21b6', to: '#8b5cf6' },
  { name: 'Negru', from: '#1e1e1e', to: '#404040' },
]

const CTA_COLOR_PRESETS = [
  { name: 'Auriu', color: '#f59e0b' },
  { name: 'Albastru', color: '#3b82f6' },
  { name: 'Verde', color: '#10b981' },
  { name: 'Rosu', color: '#ef4444' },
  { name: 'Negru', color: '#1f2937' },
]

const DEFAULT_DESIGN: DesignOptions = {
  headerColor: '#1e40af',
  headerGradientEnd: '#3b82f6',
  headerTitle: '',
  showLogo: true,
  bannerImageUrl: '',
  ctaText: '',
  ctaUrl: '',
  ctaColor: '#f59e0b',
}

type Tab = 'subscribers' | 'compose'

export default function AdminNewsletterPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('subscribers')
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [activeCount, setActiveCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Compose state
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [design, setDesign] = useState<DesignOptions>(DEFAULT_DESIGN)
  const [showDesignPanel, setShowDesignPanel] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [sendResult, setSendResult] = useState<{
    success: boolean
    sent: number
    failed: number
    total: number
  } | null>(null)

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const fetchSubscribers = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/admin/newsletter')
      const data = await res.json()
      if (data.subscribers) {
        setSubscribers(data.subscribers)
        setTotalCount(data.total)
        setActiveCount(data.active)
      }
    } catch (error) {
      console.error('Failed to fetch subscribers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnsubscribe = async (id: string, email: string) => {
    if (!confirm(`Sigur vrei sa dezabonezi ${email}?`)) return

    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        fetchSubscribers()
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error)
    }
  }

  const handleSendNewsletter = async () => {
    if (!subject.trim() || !content.trim()) return
    if (!confirm(`Trimiti newsletter-ul la ${activeCount} abonati activi?`)) return

    setIsSending(true)
    setSendResult(null)

    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim(),
          content: content.trim(),
          design,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setSendResult({
          success: true,
          sent: data.sent,
          failed: data.failed,
          total: data.total,
        })
      } else {
        setSendResult({ success: false, sent: 0, failed: 0, total: 0 })
      }
    } catch (error) {
      console.error('Failed to send newsletter:', error)
      setSendResult({ success: false, sent: 0, failed: 0, total: 0 })
    } finally {
      setIsSending(false)
    }
  }

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const updateDesign = (key: keyof DesignOptions, value: string | boolean) => {
    setDesign((prev) => ({ ...prev, [key]: value }))
  }

  // Build preview HTML that matches actual email
  const previewContentHtml = content
    .split('\n\n')
    .map((p) => `<p style="color: #374151; font-size: 15px; line-height: 1.7; margin: 0 0 16px 0;">${p.replace(/\n/g, '<br>')}</p>`)
    .join('')

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 flex-shrink-0">
        <div className="max-w-[1400px] mx-auto px-4 py-2">
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
                <Mail className="w-6 h-6 text-amber-500" />
                <h1 className="text-lg font-bold text-slate-800">Newsletter</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchSubscribers}
                className="p-2 text-slate-600 hover:text-amber-500 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delogare"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Iesire</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-[1400px] mx-auto px-4 pt-4 w-full">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${
              activeTab === 'subscribers'
                ? 'bg-white text-amber-600 border border-b-0 border-slate-200'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            Abonati ({activeCount})
          </button>
          <button
            onClick={() => setActiveTab('compose')}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${
              activeTab === 'compose'
                ? 'bg-white text-amber-600 border border-b-0 border-slate-200'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            <Send className="w-4 h-4" />
            Trimite Newsletter
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 pb-8 flex-1 w-full">
        <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-slate-200 min-h-[500px]">
          {/* ==================== SUBSCRIBERS TAB ==================== */}
          {activeTab === 'subscribers' && (
            <div className="p-6">
              {/* Stats */}
              <div className="flex gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                  <p className="text-sm text-blue-600">Total abonati</p>
                  <p className="text-2xl font-bold text-blue-800">{totalCount}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  <p className="text-sm text-green-600">Activi</p>
                  <p className="text-2xl font-bold text-green-800">{activeCount}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                  <p className="text-sm text-slate-600">Dezabonati</p>
                  <p className="text-2xl font-bold text-slate-800">{totalCount - activeCount}</p>
                </div>
              </div>

              {/* Table */}
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                </div>
              ) : subscribers.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Niciun abonat</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-slate-200">
                        <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Email</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Nume</th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-slate-600">Data abonarii</th>
                        <th className="text-center px-4 py-3 text-sm font-semibold text-slate-600">Status</th>
                        <th className="text-right px-4 py-3 text-sm font-semibold text-slate-600">Actiuni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((subscriber) => (
                        <tr
                          key={subscriber.id}
                          className={`border-b border-slate-100 ${!subscriber.isActive ? 'opacity-50' : ''}`}
                        >
                          <td className="px-4 py-3 text-sm text-slate-800">{subscriber.email}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{subscriber.name || '-'}</td>
                          <td className="px-4 py-3 text-sm text-slate-500">{formatDate(subscriber.subscribedAt)}</td>
                          <td className="px-4 py-3 text-center">
                            {subscriber.isActive ? (
                              <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                Activ
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                                <XCircle className="w-3 h-3" />
                                Dezabonat
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {subscriber.isActive && (
                              <button
                                onClick={() => handleUnsubscribe(subscriber.id, subscriber.email)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Dezaboneaza"
                              >
                                <UserMinus className="w-3.5 h-3.5" />
                                Dezaboneaza
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ==================== COMPOSE TAB ==================== */}
          {activeTab === 'compose' && (
            <div className="p-6">
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
                {/* LEFT: Editor + Design Options */}
                <div className="space-y-5">
                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">
                      Subiect email
                    </label>
                    <input
                      id="subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Ex: Oferte speciale de iarna"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">
                      Continut newsletter
                    </label>
                    <textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={"Scrie continutul newsletter-ului aici...\n\nSepara paragrafele cu un rand gol.\nRandurile noi in acelasi paragraf devin <br>."}
                      rows={10}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm resize-y font-mono"
                    />
                  </div>

                  {/* Design Options Panel */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setShowDesignPanel(!showDesignPanel)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Settings2 className="w-4 h-4" />
                        Optiuni design email
                      </span>
                      <ChevronLeft className={`w-4 h-4 text-slate-400 transition-transform ${showDesignPanel ? '-rotate-90' : 'rotate-0'}`} />
                    </button>

                    {showDesignPanel && (
                      <div className="px-4 py-4 space-y-4 border-t border-slate-200">
                        {/* Color preset */}
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-2">
                            <Palette className="w-3.5 h-3.5" />
                            Culoare header
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {COLOR_PRESETS.map((preset) => (
                              <button
                                key={preset.name}
                                onClick={() => {
                                  updateDesign('headerColor', preset.from)
                                  updateDesign('headerGradientEnd', preset.to)
                                }}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                                  design.headerColor === preset.from
                                    ? 'border-amber-400 bg-amber-50 text-amber-800 shadow-sm'
                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                              >
                                <span
                                  className="w-4 h-4 rounded-full flex-shrink-0"
                                  style={{ background: `linear-gradient(135deg, ${preset.from}, ${preset.to})` }}
                                />
                                {preset.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Header title */}
                        <div>
                          <label htmlFor="headerTitle" className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1">
                            <Type className="w-3.5 h-3.5" />
                            Titlu in header (optional)
                          </label>
                          <input
                            id="headerTitle"
                            type="text"
                            value={design.headerTitle}
                            onChange={(e) => updateDesign('headerTitle', e.target.value)}
                            placeholder="Ex: Oferte de Sezon"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                        </div>

                        {/* Show logo toggle */}
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                            {design.showLogo ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            Afiseaza logo in header
                          </label>
                          <button
                            onClick={() => updateDesign('showLogo', !design.showLogo)}
                            className={`relative w-10 h-5 rounded-full transition-colors ${
                              design.showLogo ? 'bg-amber-500' : 'bg-slate-300'
                            }`}
                            role="switch"
                            aria-checked={design.showLogo}
                          >
                            <span
                              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                                design.showLogo ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Banner image */}
                        <div>
                          <label htmlFor="bannerUrl" className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1">
                            <Image className="w-3.5 h-3.5" />
                            URL imagine banner (optional)
                          </label>
                          <input
                            id="bannerUrl"
                            type="url"
                            value={design.bannerImageUrl}
                            onChange={(e) => updateDesign('bannerImageUrl', e.target.value)}
                            placeholder="https://example.com/banner.jpg"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <p className="text-xs text-slate-400 mt-1">Dimensiune recomandata: 600x250px</p>
                        </div>

                        {/* CTA Button */}
                        <div className="space-y-2">
                          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                            <MousePointerClick className="w-3.5 h-3.5" />
                            Buton CTA (optional)
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={design.ctaText}
                              onChange={(e) => updateDesign('ctaText', e.target.value)}
                              placeholder="Text buton (ex: Vezi Ofertele)"
                              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            <input
                              type="url"
                              value={design.ctaUrl}
                              onChange={(e) => updateDesign('ctaUrl', e.target.value)}
                              placeholder="URL link (ex: https://metalfence.ro)"
                              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                          </div>
                          {design.ctaText && (
                            <div className="flex flex-wrap gap-1.5">
                              {CTA_COLOR_PRESETS.map((preset) => (
                                <button
                                  key={preset.name}
                                  onClick={() => updateDesign('ctaColor', preset.color)}
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs transition-all ${
                                    design.ctaColor === preset.color
                                      ? 'border-amber-400 bg-amber-50'
                                      : 'border-slate-200 hover:border-slate-300'
                                  }`}
                                >
                                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: preset.color }} />
                                  {preset.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={handleSendNewsletter}
                      disabled={isSending || !subject.trim() || !content.trim() || activeCount === 0}
                      className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-semibold shadow-sm"
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Se trimite...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Trimite la {activeCount} abonati
                        </>
                      )}
                    </button>
                  </div>

                  {/* Send Result */}
                  {sendResult && (
                    <div
                      className={`rounded-lg p-4 ${
                        sendResult.success
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      {sendResult.success ? (
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-800">Newsletter trimis cu succes!</p>
                            <p className="text-sm text-green-700 mt-1">
                              {sendResult.sent} din {sendResult.total} emailuri trimise
                              {sendResult.failed > 0 && (
                                <span className="text-red-600">
                                  {' '}({sendResult.failed} esuate)
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-red-800">Eroare la trimiterea newsletter-ului</p>
                            <p className="text-sm text-red-700 mt-1">Incearca din nou mai tarziu.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeCount === 0 && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      Nu exista abonati activi. Newsletter-ul nu poate fi trimis.
                    </div>
                  )}
                </div>

                {/* RIGHT: Live Preview */}
                <div className="xl:sticky xl:top-4 self-start">
                  <p className="text-sm font-medium text-slate-700 mb-2">Preview email (live)</p>
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-[#f0f2f5] shadow-inner">
                    <div className="p-4">
                      {/* Fake email client chrome */}
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ maxHeight: '680px', overflowY: 'auto' }}>
                        {/* Subject bar */}
                        <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                          <p className="text-xs text-slate-400">Subiect:</p>
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {subject || '(fara subiect)'} - Esipca Metalica
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">De la: Esipca Metalica &lt;clienti@metalfence.ro&gt;</p>
                        </div>

                        {/* Email body preview - matches actual template */}
                        <div style={{ background: '#f0f2f5', padding: '16px 12px' }}>
                          <div style={{ maxWidth: 600, margin: '0 auto' }}>
                            {/* Header */}
                            <div
                              style={{
                                background: `linear-gradient(135deg, ${design.headerColor} 0%, ${design.headerGradientEnd} 100%)`,
                                padding: '24px 20px',
                                borderRadius: '12px 12px 0 0',
                                textAlign: 'center' as const,
                              }}
                            >
                              {design.showLogo && (
                                <img
                                  src="/images/1024.png"
                                  alt="Esipca Metalica"
                                  style={{ maxHeight: 50, width: 'auto', marginBottom: 8 }}
                                />
                              )}
                              {design.headerTitle && (
                                <p style={{
                                  color: 'white',
                                  margin: '8px 0 0 0',
                                  fontSize: 18,
                                  fontWeight: 700,
                                  letterSpacing: 0.5,
                                }}>
                                  {design.headerTitle}
                                </p>
                              )}
                            </div>

                            {/* Banner */}
                            {design.bannerImageUrl && (
                              <div style={{ background: 'white' }}>
                                <img
                                  src={design.bannerImageUrl}
                                  alt=""
                                  style={{ width: '100%', maxHeight: 200, objectFit: 'cover' as const, display: 'block' }}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none'
                                  }}
                                />
                              </div>
                            )}

                            {/* Body */}
                            <div style={{ background: 'white', padding: '28px 24px 16px 24px' }}>
                              <p style={{ fontSize: 14, color: '#374151', margin: '0 0 16px 0' }}>
                                Buna, <strong>Client</strong>!
                              </p>

                              {content ? (
                                <div dangerouslySetInnerHTML={{ __html: previewContentHtml }} />
                              ) : (
                                <p style={{ color: '#9ca3af', fontSize: 14, fontStyle: 'italic' }}>
                                  Scrie continutul pentru a vedea preview-ul...
                                </p>
                              )}

                              {/* CTA Button */}
                              {design.ctaText && design.ctaUrl && (
                                <div style={{ textAlign: 'center' as const, margin: '24px 0' }}>
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      background: design.ctaColor,
                                      color: 'white',
                                      padding: '12px 28px',
                                      borderRadius: 8,
                                      fontWeight: 700,
                                      fontSize: 14,
                                      letterSpacing: 0.3,
                                    }}
                                  >
                                    {design.ctaText}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Divider */}
                            <div style={{ background: 'white', padding: '0 24px' }}>
                              <div style={{ borderTop: '1px solid #e5e7eb' }} />
                            </div>

                            {/* Footer contact */}
                            <div style={{ background: 'white', padding: '20px 24px', textAlign: 'center' as const }}>
                              <p style={{ color: '#6b7280', fontSize: 11, margin: '0 0 4px 0' }}>
                                <strong>Esipca Metalica</strong> — Garduri si porti metalice de calitate
                              </p>
                              <p style={{ color: '#9ca3af', fontSize: 11, margin: 0 }}>
                                +40 (722) 292 519 • clienti@metalfence.ro
                              </p>
                              <p style={{ margin: '8px 0 0 0' }}>
                                <span style={{ color: '#3b82f6', fontSize: 11, fontWeight: 600 }}>metalfence.ro</span>
                              </p>
                            </div>

                            {/* Bottom bar */}
                            <div
                              style={{
                                background: design.headerColor,
                                padding: '12px 24px',
                                borderRadius: '0 0 12px 12px',
                                textAlign: 'center' as const,
                              }}
                            >
                              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, margin: 0 }}>
                                © {new Date().getFullYear()} Esipca Metalica. Toate drepturile rezervate.
                              </p>
                              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, margin: '4px 0 0 0' }}>
                                Primesti acest email pentru ca te-ai abonat la newsletter-ul nostru.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

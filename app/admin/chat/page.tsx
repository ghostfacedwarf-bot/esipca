'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, Send, Loader2, RefreshCw, User, Clock, Globe, CheckCircle, XCircle, LogOut, Trash2, Package, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Chat {
  id: string
  sessionId: string
  visitorName: string | null
  visitorLang: string
  status: string
  unreadCount: number
  createdAt: string
  updatedAt: string
  messages: {
    id: string
    originalText: string
    translatedText: string | null
    sender: string
    createdAt: string
  }[]
  _count: {
    messages: number
  }
}

interface Message {
  id: string
  sender: string
  originalText: string
  translatedText: string | null
  originalLang: string | null
  createdAt: string
}

export default function AdminChatPage() {
  const router = useRouter()
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [replyText, setReplyText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Fetch all chats
  const fetchChats = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(`/api/chat/admin?status=${statusFilter}`)
      const data = await res.json()
      if (data.chats) {
        setChats(data.chats)
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch messages for selected chat
  const fetchMessages = async (chatId: string) => {
    try {
      const res = await fetch(`/api/chat/${chatId}/messages`)
      const data = await res.json()
      if (data.messages) {
        setMessages(data.messages)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  useEffect(() => {
    fetchChats()
    // Poll for new chats every 10 seconds
    const interval = setInterval(fetchChats, 10000)
    return () => clearInterval(interval)
  }, [statusFilter])

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id)
      // Poll for new messages every 5 seconds
      const interval = setInterval(() => fetchMessages(selectedChat.id), 5000)
      return () => clearInterval(interval)
    }
  }, [selectedChat?.id])

  // Auto-scroll disabled - user preference
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  // }, [messages])

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat)
    setMessages([])
  }

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedChat || isSending) return

    setIsSending(true)
    try {
      const res = await fetch(`/api/chat/${selectedChat.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyText.trim() }),
      })

      const data = await res.json()
      if (data.success) {
        setReplyText('')
        fetchMessages(selectedChat.id)
      }
    } catch (error) {
      console.error('Failed to send reply:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleUpdateStatus = async (chatId: string, status: string) => {
    try {
      await fetch('/api/chat/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, status }),
      })
      fetchChats()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleDeleteChat = async (chatId: string) => {
    if (!confirm('Sigur vrei să ștergi această conversație?')) return

    try {
      await fetch('/api/chat/admin', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId }),
      })
      setSelectedChat(null)
      setMessages([])
      fetchChats()
    } catch (error) {
      console.error('Failed to delete chat:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendReply()
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getLanguageName = (code: string) => {
    const langs: Record<string, string> = {
      ro: 'Română',
      en: 'English',
      de: 'Deutsch',
      fr: 'Français',
      es: 'Español',
      it: 'Italiano',
      hu: 'Magyar',
      pl: 'Polski',
      ru: 'Русский',
      uk: 'Українська',
    }
    return langs[code] || code.toUpperCase()
  }

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
                <MessageCircle className="w-6 h-6 text-amber-500" />
                <h1 className="text-lg font-bold text-slate-800">Chat</h1>
              </div>
              <Link
                href="/admin/products"
                className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Package className="w-5 h-5" />
                <span className="text-sm font-medium">Produse</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Toate chat-urile</option>
                <option value="active">Active</option>
                <option value="resolved">Rezolvate</option>
              </select>
              <button
                onClick={fetchChats}
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
                <span className="text-sm font-medium">Ieșire</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 py-2 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
          {/* Chat List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 flex-shrink-0">
              <h2 className="font-semibold text-slate-700">Conversații ({chats.length})</h2>
            </div>
            <div className="overflow-y-auto flex-1">
              {chats.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Nicio conversație</p>
                </div>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => handleSelectChat(chat)}
                    className={`p-4 border-b border-slate-100 cursor-pointer transition-colors ${
                      selectedChat?.id === chat.id
                        ? 'bg-amber-50 border-l-4 border-l-amber-500'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-5 h-5 text-slate-400" />
                        <span className="font-medium text-slate-800">
                          {chat.visitorName || 'Vizitator anonim'}
                        </span>
                      </div>
                      {chat.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {getLanguageName(chat.visitorLang)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(chat.updatedAt)}
                      </span>
                    </div>
                    {chat.messages[0] && (
                      <p className="mt-2 text-sm text-slate-600 truncate">
                        {chat.messages[0].translatedText || chat.messages[0].originalText}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          chat.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {chat.status === 'active' ? 'Activ' : 'Rezolvat'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {chat._count.messages} mesaje
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
                  <div>
                    <h2 className="font-semibold text-slate-800">
                      {selectedChat.visitorName || 'Vizitator anonim'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {getLanguageName(selectedChat.visitorLang)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedChat.status === 'active' ? (
                      <button
                        onClick={() => handleUpdateStatus(selectedChat.id, 'resolved')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Marchează rezolvat
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(selectedChat.id, 'active')}
                        className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Redeschide
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteChat(selectedChat.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Șterge
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="overflow-y-auto p-4 space-y-3 bg-slate-50" style={{ maxHeight: '300px' }}>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                          msg.sender === 'admin'
                            ? 'bg-amber-500 text-white rounded-br-sm'
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                        }`}
                      >
                        {msg.sender === 'visitor' && (
                          <>
                            {/* Show translated text (English) for admin to read */}
                            <p className="text-sm font-medium">
                              {msg.translatedText || msg.originalText}
                            </p>
                            {msg.translatedText && msg.translatedText !== msg.originalText && (
                              <p className="text-xs text-slate-400 mt-1 italic border-t border-slate-100 pt-1">
                                Original ({msg.originalLang}): {msg.originalText}
                              </p>
                            )}
                          </>
                        )}
                        {msg.sender === 'admin' && (
                          <>
                            <p className="text-sm">{msg.originalText}</p>
                            {msg.translatedText && msg.translatedText !== msg.originalText && (
                              <p className="text-xs text-amber-200 mt-1 italic border-t border-amber-400/30 pt-1">
                                → {msg.translatedText}
                              </p>
                            )}
                          </>
                        )}
                        <span
                          className={`text-xs mt-1 block ${
                            msg.sender === 'admin' ? 'text-amber-200' : 'text-slate-400'
                          }`}
                        >
                          {formatDate(msg.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Input */}
                <div className="px-3 py-2 border-t border-slate-200 bg-white flex-shrink-0">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Scrie răspunsul în română..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isSending}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={isSending || !replyText.trim()}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white rounded-lg transition-colors flex items-center gap-2 text-sm"
                    >
                      {isSending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Trimite
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Selectează o conversație</p>
                  <p className="text-sm">pentru a vedea mesajele</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

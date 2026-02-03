'use client'

import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'

interface Message {
  id: string
  sender: 'visitor' | 'admin'
  originalText: string
  translatedText?: string
  createdAt: string
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>('')
  const [visitorName, setVisitorName] = useState('')
  const [showNameInput, setShowNameInput] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Generate or get session ID
  useEffect(() => {
    let sid = localStorage.getItem('chat_session_id')
    if (!sid) {
      sid = 'chat_' + Math.random().toString(36).substring(2, 15)
      localStorage.setItem('chat_session_id', sid)
    }
    setSessionId(sid)

    // Check for saved name
    const savedName = localStorage.getItem('chat_visitor_name')
    if (savedName) {
      setVisitorName(savedName)
      setShowNameInput(false)
    }
  }, [])

  // Fetch existing messages
  useEffect(() => {
    if (!sessionId) return

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat?sessionId=${sessionId}`)
        const data = await res.json()
        if (data.messages) {
          setMessages(data.messages)
          if (data.messages.length > 0) {
            setShowNameInput(false)
          }
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      }
    }

    fetchMessages()

    // Poll for new messages every 5 seconds when chat is open
    const interval = setInterval(() => {
      if (isOpen) fetchMessages()
    }, 5000)

    return () => clearInterval(interval)
  }, [sessionId, isOpen])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Count unread admin messages
  useEffect(() => {
    if (!isOpen) {
      const unread = messages.filter(m => m.sender === 'admin' && !m.translatedText).length
      setUnreadCount(unread)
    }
  }, [messages, isOpen])

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return

    const messageText = inputText.trim()
    setInputText('')
    setIsLoading(true)

    // Optimistic update
    const tempMessage: Message = {
      id: 'temp_' + Date.now(),
      sender: 'visitor',
      originalText: messageText,
      createdAt: new Date().toISOString(),
    }
    setMessages(prev => [...prev, tempMessage])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: messageText,
          visitorName: visitorName || undefined,
        }),
      })

      const data = await res.json()

      if (data.success) {
        // Replace temp message with real one
        setMessages(prev =>
          prev.map(m => (m.id === tempMessage.id ? data.message : m))
        )

        // Save name
        if (visitorName) {
          localStorage.setItem('chat_visitor_name', visitorName)
        }
        setShowNameInput(false)

        // Open WhatsApp notification in background (optional - for admin notification)
        // This creates the link but doesn't auto-open (browser blocks it)
        console.log('WhatsApp notification:', data.whatsappNotification)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      // Remove temp message on error
      setMessages(prev => prev.filter(m => m.id !== tempMessage.id))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Button - positioned above GoogleTranslator */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          boxShadow: isOpen ? undefined : '0 4px 20px rgba(245, 158, 11, 0.4)',
          bottom: '150px',
          right: '20px',
          zIndex: 10001,
        }}
        className={`fixed rounded-[50px] flex items-center justify-center gap-2.5 transition-all duration-300 hover:-translate-y-0.5 ${
          isOpen
            ? 'bg-slate-600 hover:bg-slate-700 w-14 h-14 rounded-full'
            : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-6 py-3'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-5 h-5 text-white" />
            <span className="text-white font-semibold text-[15px]">Live Chat</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat Window - fits within viewport */}
      {isOpen && (
        <div className="fixed w-80 sm:w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col" style={{ bottom: '220px', right: '20px', zIndex: 10000, maxHeight: 'calc(100vh - 240px)', height: '450px' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 flex-shrink-0">
            <h3 className="font-semibold text-base">Live Chat</h3>
            <p className="text-sm text-amber-100">
              Scrie în orice limbă - traducem automat
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {messages.length === 0 && (
              <div className="text-center text-slate-400 py-8">
                <MessageCircle className="w-14 h-14 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Trimite un mesaj pentru a începe</p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    msg.sender === 'visitor'
                      ? 'bg-amber-500 text-white rounded-br-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">
                    {msg.sender === 'admin' ? msg.translatedText || msg.originalText : msg.originalText}
                  </p>
                  <span className={`text-xs ${msg.sender === 'visitor' ? 'text-amber-200' : 'text-slate-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Name Input (first time only) */}
          {showNameInput && messages.length === 0 && (
            <div className="px-4 py-3 bg-blue-50 border-t border-blue-100">
              <input
                type="text"
                placeholder="Numele tău (opțional)"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-slate-200 bg-white flex-shrink-0">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Scrie un mesaj..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !inputText.trim()}
                className="w-11 h-11 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 rounded-full flex items-center justify-center text-white transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

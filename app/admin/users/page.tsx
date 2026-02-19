'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Users, ChevronLeft, LogOut, RefreshCw, Loader2, Plus, X,
  Pencil, Trash2, Eye, EyeOff, Shield, UserCog,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: string
  updatedAt: string
}

interface Stats {
  total: number
  admins: number
  editors: number
  latest: string | null
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, admins: 0, editors: 0, latest: null })
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formRole, setFormRole] = useState<'admin' | 'editor'>('editor')
  const [formPassword, setFormPassword] = useState('')

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (data.users) {
        setUsers(data.users)
        setStats(data.stats)
      }
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const openCreateModal = () => {
    setEditingUser(null)
    setFormName('')
    setFormEmail('')
    setFormRole('editor')
    setFormPassword('')
    setShowPassword(false)
    setError('')
    setShowModal(true)
  }

  const openEditModal = (user: User) => {
    setEditingUser(user)
    setFormName(user.name || '')
    setFormEmail(user.email)
    setFormRole(user.role as 'admin' | 'editor')
    setFormPassword('')
    setShowPassword(false)
    setError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      if (editingUser) {
        // Update user
        const body: Record<string, string> = { userId: editingUser.id }
        if (formName !== (editingUser.name || '')) body.name = formName
        if (formEmail !== editingUser.email) body.email = formEmail
        if (formRole !== editingUser.role) body.role = formRole
        if (formPassword) body.password = formPassword

        const res = await fetch('/api/admin/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.message || 'Eroare la actualizare')
          return
        }
      } else {
        // Create user
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName,
            email: formEmail,
            role: formRole,
            password: formPassword,
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.message || 'Eroare la creare')
          return
        }
      }

      closeModal()
      fetchUsers()
    } catch (err) {
      setError('Eroare de retea')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (user: User) => {
    if (!window.confirm(`Sigur doriti sa stergeti utilizatorul "${user.name || user.email}"?`)) return

    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.message || 'Eroare la stergere')
        return
      }
      fetchUsers()
    } catch (err) {
      alert('Eroare de retea')
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return email.slice(0, 2).toUpperCase()
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-purple-100 hover:text-purple-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <div className="flex items-center gap-2">
                <Users className="w-6 h-6 text-purple-500" />
                <h1 className="text-lg font-bold text-slate-800">Utilizatori</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Adauga utilizator
              </button>
              <button
                onClick={fetchUsers}
                className="p-2 text-slate-600 hover:text-purple-500 transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
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
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
            <p className="text-xs text-slate-500">Total utilizatori</p>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3">
            <p className="text-xs text-purple-600">Administratori</p>
            <p className="text-2xl font-bold text-purple-700">{stats.admins}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <p className="text-xs text-blue-600">Editori</p>
            <p className="text-2xl font-bold text-blue-700">{stats.editors}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
            <p className="text-xs text-slate-500">Ultima inregistrare</p>
            <p className="text-sm font-semibold text-slate-700 mt-1">
              {stats.latest ? formatDate(stats.latest) : '-'}
            </p>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Niciun utilizator gasit</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {users.map((user) => (
                <div key={user.id} className="flex items-center gap-4 px-6 py-4 hover:bg-purple-50/30 transition-colors">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-purple-600">
                      {getInitials(user.name, user.email)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user.name || 'Fara nume'}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>

                  {/* Role Badge */}
                  <div className="flex-shrink-0">
                    {user.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                        <Shield className="w-3 h-3" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                        <UserCog className="w-3 h-3" />
                        Editor
                      </span>
                    )}
                  </div>

                  {/* Date */}
                  <p className="text-xs text-slate-400 flex-shrink-0 hidden sm:block">
                    {formatDate(user.createdAt)}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => openEditModal(user)}
                      className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Editeaza"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Sterge"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-800">
                {editingUser ? 'Editeaza utilizator' : 'Adauga utilizator'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-slate-700 mb-1">
                  Nume
                </label>
                <input
                  id="userName"
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Nume complet"
                />
              </div>

              <div>
                <label htmlFor="userEmail" className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  id="userEmail"
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="email@exemplu.ro"
                />
              </div>

              <div>
                <label htmlFor="userRole" className="block text-sm font-medium text-slate-700 mb-1">
                  Rol
                </label>
                <select
                  id="userRole"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as 'admin' | 'editor')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="admin">Administrator</option>
                  <option value="editor">Editor</option>
                </select>
              </div>

              <div>
                <label htmlFor="userPassword" className="block text-sm font-medium text-slate-700 mb-1">
                  Parola {editingUser && <span className="text-slate-400 font-normal">(lasa gol pentru a pastra)</span>}
                </label>
                <div className="relative">
                  <input
                    id="userPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    required={!editingUser}
                    minLength={8}
                    className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder={editingUser ? 'Parola noua (optional)' : 'Minim 8 caractere'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Anuleaza
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-300 text-white rounded-lg transition-colors text-sm font-semibold"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Se salveaza...
                    </>
                  ) : editingUser ? (
                    'Salveaza'
                  ) : (
                    'Creeaza'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

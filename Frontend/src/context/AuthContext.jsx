/* eslint-disable react-refresh/only-export-components -- hook exported alongside provider (standard pattern). */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import * as accountsApi from '../api/accounts.js'
import { STORAGE_KEYS } from '../utils/constants.js'

const AuthContext = createContext(null)

/**
 * Decode JWT payload without external libs (for role when API omits user object).
 */
function decodeJwtPayload(token) {
  try {
    const part = token.split('.')[1]
    if (!part) return {}
    const padded = part + '='.repeat((4 - (part.length % 4)) % 4)
    const json = atob(padded.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return {}
  }
}

/**
 * Normalize user shape; ensure role string matches app constants when possible.
 */
function normalizeUser(raw, token) {
  if (raw && typeof raw === 'object') {
    let role = String(raw.role ?? raw.user_type ?? '').toLowerCase()
    if (!role && token) {
      const p = decodeJwtPayload(token)
      role = String(p.role ?? p.user_role ?? '').toLowerCase()
    }
    return { ...raw, role }
  }
  if (token) {
    const p = decodeJwtPayload(token)
    const role = String(p.role ?? p.user_role ?? '').toLowerCase()
    return {
      id: p.user_id ?? p.sub,
      email: p.email,
      role,
    }
  }
  return null
}

function parseStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) ?? 'null')
  } catch {
    return null
  }
}

function readStoredAuth() {
  const t = localStorage.getItem(STORAGE_KEYS.TOKEN)
  const parsed = parseStoredUser()
  return {
    token: t,
    user: t ? normalizeUser(parsed, t) : null,
  }
}

const initialAuth = readStoredAuth()

function extractAuthFromResponse(data) {
  const token = data?.access ?? data?.access_token ?? data?.token
  const userRaw = data?.user ?? (data?.email || data?.role ? data : null)
  const user = normalizeUser(userRaw, token)
  return { token, user }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(initialAuth.token)
  const [user, setUser] = useState(initialAuth.user)

  const persist = useCallback((nextToken, nextUser) => {
    if (nextToken) localStorage.setItem(STORAGE_KEYS.TOKEN, nextToken)
    else localStorage.removeItem(STORAGE_KEYS.TOKEN)
    if (nextUser) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(nextUser))
    else localStorage.removeItem(STORAGE_KEYS.USER)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    persist(null, null)
  }, [persist])

  const login = useCallback(
    async (credentials) => {
      const { data } = await accountsApi.login(credentials)
      const { token: t, user: usr } = extractAuthFromResponse(data)
      if (!t) throw new Error('No access token returned from server.')
      const merged = normalizeUser(usr, t)
      setToken(t)
      setUser(merged)
      persist(t, merged)
      return merged
    },
    [persist]
  )

  const register = useCallback(
    async (payload) => {
      const { data } = await accountsApi.register(payload)
      const { token: t, user: usr } = extractAuthFromResponse(data)
      if (t) {
        const merged = normalizeUser(usr, t)
        setToken(t)
        setUser(merged)
        persist(t, merged)
        return merged
      }
      return null
    },
    [persist]
  )

  const updateLocalUser = useCallback(
    (partial) => {
      setUser((prev) => {
        const next = { ...prev, ...partial }
        persist(token, next)
        return next
      })
    },
    [persist, token]
  )

  const value = useMemo(
    () => ({
      user,
      token,
      initialized: true,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
      updateLocalUser,
    }),
    [user, token, login, register, logout, updateLocalUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

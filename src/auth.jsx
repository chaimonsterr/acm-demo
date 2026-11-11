import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase.js'

const AuthContext = createContext({ user: null, ready: false })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setReady(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    return () => data.subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, ready }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
export const displayName = (user) => user?.user_metadata?.full_name || ''

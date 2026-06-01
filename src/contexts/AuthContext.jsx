import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get current session
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
      setLoading(false)
    }

    init()

    // Listen auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // ---------------- LOGIN ----------------
  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw new Error(error.message)

    setUser(data.user)
    return data.user
  }

  // ---------------- SIGNUP ----------------
  const signup = async (name, email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    })

    if (error) throw new Error(error.message)

    setUser(data.user)
    return data.user
  }

  // ---------------- LOGOUT ----------------
  const logout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) throw new Error(error.message)

    setUser(null)
  }

  // ---------------- UPDATE USER (FIXED) ----------------
  const updateUser = async (updates) => {
    const supabaseUpdates = {}

    // email update
    if (updates.email) {
      supabaseUpdates.email = updates.email
    }

    // metadata update (name + avatar)
    if (updates.name || updates.avatar_url) {
      supabaseUpdates.data = {
        full_name: updates.name,
        avatar_url: updates.avatar_url,
      }
    }

    const { data, error } = await supabase.auth.updateUser(supabaseUpdates)

    if (error) throw new Error(error.message)

    const updatedUser = data.user

    // IMPORTANT: sync React state
    setUser(updatedUser)

    return updatedUser
  }

  // ---------------- UPDATE PASSWORD ----------------
  const updatePassword = async (currentPassword, newPassword) => {
    if (!user) throw new Error('No authenticated user found.')

    // verify current password
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })

    if (authError) {
      throw new Error('Current password is incorrect.')
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw new Error(error.message)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        updateUser,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ---------------- HOOK ----------------
export const useAuth = () => {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return ctx
}
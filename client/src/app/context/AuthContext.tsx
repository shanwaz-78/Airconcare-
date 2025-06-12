'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { loginUser, registerUser, getUser } from '../lib/auth'
import { AuthContextType, User } from '../lib/types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const userData = await getUser()
                setUser(userData)
            } catch (error) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        initializeAuth()
    }, [])

    const login = async (email: string, password: string) => {
        const userData = await loginUser(email, password)
        setUser(userData)
        router.push(userData.role === 'admin' ? '/admin/dashboard' : '/client/dashboard')
    }

    const register = async (email: string, password: string, role: 'client' | 'admin') => {
        const userData = await registerUser(email, password, role)
        setUser(userData)
        router.push(userData.role === 'admin' ? '/admin/dashboard' : '/client/dashboard')
    }

    const logout = () => {
        setUser(null)
        router.push('/login')
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
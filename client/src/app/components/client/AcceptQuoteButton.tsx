'use client'

import { useState } from 'react'
import { acceptQuote } from '@/lib/api'
import { useRouter } from 'next/navigation'
import React from 'react'

export function AcceptQuoteButton({ contractId }: { contractId: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleAccept = async () => {
        setIsLoading(true)
        setError(null)
        try {
            await acceptQuote(contractId)
            router.refresh()
        } catch (err) {
            setError('Failed to accept quote')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <button
                onClick={handleAccept}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
                {isLoading ? 'Accepting...' : 'Accept Quote'}
            </button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    )
}
'use client'

import { useState } from 'react'
import { completePayment } from '@/lib/api'
import { useRouter } from 'next/navigation'
import React from 'react'

export function PaymentButton({
    contractId,
    amount,
}: {
    contractId: string
    amount: number
}) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handlePayment = async () => {
        setIsLoading(true)
        setError(null)
        try {
            await completePayment(contractId)
            router.refresh()
        } catch (err) {
            setError('Payment failed')
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div>
            <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
                {isLoading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
            </button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    )
}
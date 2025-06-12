import { ContractCard } from '@/components/client/ContractCard'
import { NewContractForm } from '@/components/client/NewContractForm'
import { Metadata } from 'next'
import { getContracts } from '@/lib/api'
import { auth } from '@/lib/auth'
import React from 'react'

export const metadata: Metadata = {
    title: 'AirconCare - Client Dashboard',
}

export default async function ClientDashboard() {
    const session = await auth()
    if (!session?.user) {
        return <div>Not authenticated</div>
    }

    const contracts = await getContracts(session.user.id)

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">My Contracts</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {contracts.map((contract) => (
                            <ContractCard key={contract.id} contract={contract} />
                        ))}
                    </div>
                </div>
                <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Request New Contract
                    </h2>
                    <NewContractForm />
                </div>
            </div>
        </div>
    )
}
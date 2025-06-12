import { ContractAdminCard } from '@/components/admin/ContractAdminCard'
import { Metadata } from 'next'
import { getAllContracts } from '@/lib/api'
import { auth } from '@/lib/auth'
import React from 'react'

export const metadata: Metadata = {
    title: 'AirconCare - Admin Dashboard',
}

export default async function AdminDashboard() {
    const session = await auth()
    if (!session?.user || session.user.role !== 'admin') {
        return <div>Not authorized</div>
    }

    const contracts = await getAllContracts()

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
                <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">All Contracts</h2>
                    <div className="grid grid-cols-1 gap-6">
                        {contracts.map((contract) => (
                            <ContractAdminCard key={contract.id} contract={contract} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
import { ContractDetails } from '@/components/client/ContractDetails'
import { Metadata } from 'next'
import { getContract } from '@/lib/api'
import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

export async function generateMetadata({
    params,
}: {
    params: { id: string }
}): Promise<Metadata> {
    return {
        title: `AirconCare - Contract ${params.id.slice(0, 6)}`,
    }
}

export default async function ClientContractPage({
    params,
}: {
    params: { id: string }
}) {
    const session = await auth()
    if (!session?.user) {
        redirect('/login')
    }

    const contract = await getContract(params.id)
    if (!contract || contract.clientId !== session.user.id) {
        notFound()
    }

    return (
        <div className="py-6">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Contract #{contract.id.slice(0, 6)}
                    </h1>
                </div>
                <ContractDetails contract={contract} />
            </div>
        </div>
    )
}
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { updateContrupact } from '@/lib/api'
import { Contract } from '@/lib/types'
import { useRouter } from 'next/navigation'
import React from 'react'

const contractSchema = z.object({
    quoteAmount: z.number().min(0, 'Amount must be positive').optional(),
    serviceDate: z.string().optional(),
    technician: z.string().optional(),
    notes: z.string().optional(),
})

type ContractFormValues = z.infer<typeof contractSchema>

export function UpdateContractForm({ contract }: { contract: Contract }) {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ContractFormValues>({
        resolver: zodResolver(contractSchema),
        defaultValues: {
            quoteAmount: contract.quoteAmount,
            serviceDate: contract.serviceDate?.toISOString().split('T')[0],
            technician: contract.technician,
        },
    })

    const onSubmit = async (data: ContractFormValues) => {
        setError(null)
        try {
            await updateContract(contract.id, {
                ...data,
                serviceDate: data.serviceDate ? new Date(data.serviceDate) : undefined,
                notes: data.notes ? [...(contract.notes || []), data.notes] : undefined,
            })
            router.refresh()
        } catch (err) {
            setError('Failed to update contract')
            console.error(err)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Update Contract</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="quoteAmount"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Quote Amount
                        </label>
                        <input
                            type="number"
                            id="quoteAmount"
                            step="0.01"
                            min="0"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            {...register('quoteAmount', { valueAsNumber: true })}
                        />
                        {errors.quoteAmount && (
                            <p className="mt-1 text-sm text-red-600">{errors.quoteAmount.message}</p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="serviceDate"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Service Date
                        </label>
                        <input
                            type="date"
                            id="serviceDate"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            {...register('serviceDate')}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="technician"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Technician
                        </label>
                        <input
                            type="text"
                            id="technician"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            {...register('technician')}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                            Add Note
                        </label>
                        <textarea
                            id="notes"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            {...register('notes')}
                        />
                    </div>
                </div>
            </div>
            <div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {isSubmitting ? 'Updating...' : 'Update Contract'}
                </button>
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
        </form>
    )
}
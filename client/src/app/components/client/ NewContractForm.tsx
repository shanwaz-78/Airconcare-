'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createContract } from '@/lib/api'
import { useRouter } from 'next/navigation'
import React from 'react'

const contractSchema = z.object({
    acType: z.string().min(1, 'AC type is required'),
    unitCount: z.number().min(1, 'At least one unit is required'),
    address: z.string().min(1, 'Address is required'),
    preferredDate: z.string().min(1, 'Preferred date is required'),
})

type ContractFormValues = z.infer<typeof contractSchema>

export function NewContractForm() {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ContractFormValues>({
        resolver: zodResolver(contractSchema),
    })

    const onSubmit = async (data: ContractFormValues) => {
        try {
            await createContract({
                ...data,
                preferredDate: new Date(data.preferredDate),
            })
            router.refresh()
        } catch (error) {
            console.error('Failed to create contract:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label
                                htmlFor="acType"
                                className="block text-sm font-medium text-gray-700"
                            >
                                AC Type
                            </label>
                            <select
                                id="acType"
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                {...register('acType')}
                            >
                                <option value="">Select AC Type</option>
                                <option value="Split AC">Split AC</option>
                                <option value="Window AC">Window AC</option>
                                <option value="Central AC">Central AC</option>
                                <option value="Portable AC">Portable AC</option>
                            </select>
                            {errors.acType && (
                                <p className="mt-1 text-sm text-red-600">{errors.acType.message}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="unitCount"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Number of Units
                            </label>
                            <input
                                type="number"
                                id="unitCount"
                                min="1"
                                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                {...register('unitCount', { valueAsNumber: true })}
                            />
                            {errors.unitCount && (
                                <p className="mt-1 text-sm text-red-600">{errors.unitCount.message}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="address"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Address
                            </label>
                            <textarea
                                id="address"
                                rows={3}
                                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                {...register('address')}
                            />
                            {errors.address && (
                                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="preferredDate"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Preferred Service Date
                            </label>
                            <input
                                type="date"
                                id="preferredDate"
                                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                {...register('preferredDate')}
                            />
                            {errors.preferredDate && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.preferredDate.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        Request Contract
                    </button>
                </div>
            </div>
        </form>
    )
}
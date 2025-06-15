"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createContract } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Toaster, toast } from "react-hot-toast";

export const contractSchema = z.object({
  acType: z.string().min(1, "AC Type is required"),
  address: z.string().min(1, "Address is required"),
  unitCount: z.number().min(1, "At least one unit is required"),
  preferredDate: z.string().min(1, "Preferred date is required"),
  quoteAmount: z.number().min(0, "Quote amount must be a positive number"),
  notes: z.string().optional(),
});

type ContractFormValues = z.infer<typeof contractSchema>;

type NewContractFormProps = {
  onSuccess?: () => void;
};

export function NewContractForm({ onSuccess }: NewContractFormProps) {
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
  });

  const onSubmit = async (data: ContractFormValues) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const notesArray = data.notes
      ? data.notes.split(",").map((note) => note.trim())
      : undefined;

    try {
      await createContract({
        acType: data.acType,
        address: data.address,
        unitCount: data.unitCount,
        preferredDate: new Date(data.preferredDate),
        quoteAmount: data.quoteAmount,
        clientId: user.id,
        notes: notesArray,
      });

      toast.success(
        "Service Scheduled Successfully. Technician will contact you."
      );
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create contract:", error);
      toast.error("Failed to schedule service. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Toaster position="top-right" />
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
                {...register("acType")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Select AC Type</option>
                <option value="Split AC">Split AC</option>
                <option value="Window AC">Window AC</option>
                <option value="Central AC">Central AC</option>
                <option value="Portable AC">Portable AC</option>
              </select>
              {errors.acType && (
                <p className="text-sm text-red-600">{errors.acType.message}</p>
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
                {...register("unitCount", { valueAsNumber: true })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.unitCount && (
                <p className="text-sm text-red-600">
                  {errors.unitCount.message}
                </p>
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
                {...register("address")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="preferredDate"
                className="block text-sm font-medium text-gray-700"
              >
                Preferred Date
              </label>
              <input
                type="date"
                id="preferredDate"
                {...register("preferredDate")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.preferredDate && (
                <p className="text-sm text-red-600">
                  {errors.preferredDate.message}
                </p>
              )}
            </div>

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
                min="0"
                {...register("quoteAmount", { valueAsNumber: true })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
              {errors.quoteAmount && (
                <p className="text-sm text-red-600">
                  {errors.quoteAmount.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700"
              >
                Notes
              </label>
              <textarea
                id="notes"
                rows={2}
                {...register("notes")}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 text-right">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            Request Contract
          </button>
        </div>
      </div>
    </form>
  );
}

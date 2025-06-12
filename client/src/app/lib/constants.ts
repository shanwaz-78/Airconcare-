import { FSMStatus } from "./types";

export const STATUS_TRANSITIONS: Record<FSMStatus, FSMStatus[]> = {
  "Quote Requested": ["Quote Sent"],
  "Quote Sent": ["Accepted by Client", "Quote Requested"],
  "Accepted by Client": ["Payment Completed"],
  "Payment Completed": ["Service Scheduled"],
  "Service Scheduled": ["In Progress"],
  "In Progress": ["Completed"],
  Completed: [],
};

export const STATUS_COLORS: Record<FSMStatus, string> = {
  "Quote Requested": "bg-yellow-100 text-yellow-800",
  "Quote Sent": "bg-blue-100 text-blue-800",
  "Accepted by Client": "bg-purple-100 text-purple-800",
  "Payment Completed": "bg-green-100 text-green-800",
  "Service Scheduled": "bg-indigo-100 text-indigo-800",
  "In Progress": "bg-orange-100 text-orange-800",
  Completed: "bg-gray-100 text-gray-800",
};

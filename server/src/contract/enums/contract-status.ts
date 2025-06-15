export enum ContractStatus {
  QUOTE_REQUESTED = "Quote Requested",
  QUOTE_SENT = "Quote Sent",
  ACCEPTED_BY_CLIENT = "Accepted by Client",
  PAYMENT_COMPLETED = "Payment Completed",
  SERVICE_SCHEDULED = "Service Scheduled",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}

export type FSMStatus =
  | "Quote Requested"
  | "Quote Sent"
  | "Accepted by Client"
  | "Payment Completed"
  | "Service Scheduled"
  | "In Progress"
  | "Completed";

export const STATUS_TRANSITIONS: Record<FSMStatus, FSMStatus[]> = {
  "Quote Requested": ["Quote Sent"],
  "Quote Sent": ["Accepted by Client", "Quote Requested"],
  "Accepted by Client": ["Payment Completed"],
  "Payment Completed": ["Service Scheduled"],
  "Service Scheduled": ["In Progress"],
  "In Progress": ["Completed"],
  Completed: [],
};

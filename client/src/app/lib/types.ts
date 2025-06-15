export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    role: "client" | "admin"
  ) => Promise<void>;
  logout: () => void;
}

export type User = {
  data: any;
  id: string;
  name: string;
  password: string;
  email: string;
  role?: "admin" | "client";
};

export type DecodedUser = {
  sub: string;
  email: string;
  role: string;
};

export type Contract = {
  id: string;
  clientId: string;
  status: FSMStatus;
  acType: string;
  unitCount: number;
  address: string;
  preferredDate: Date;
  serviceDate?: Date;
  quoteAmount?: number;
  notes?: string[];
};

export type ContractResponse = {
  notes: Contract[];
  message: string;
};

export type FSMStatus =
  | "Quote Requested"
  | "Quote Sent"
  | "Accepted by Client"
  | "Payment Completed"
  | "Service Scheduled"
  | "In Progress"
  | "Completed";

export enum ContractStatus {
  QUOTE_REQUESTED = "Quote Requested",
  QUOTE_SENT = "Quote Sent",
  ACCEPTED_BY_CLIENT = "Accepted by Client",
  PAYMENT_COMPLETED = "Payment Completed",
  SERVICE_SCHEDULED = "Service Scheduled",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}

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
  role: "admin" | "client";
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
  technician?: string;
};

export type FSMStatus =
  | "Quote Requested"
  | "Quote Sent"
  | "Accepted by Client"
  | "Payment Completed"
  | "Service Scheduled"
  | "In Progress"
  | "Completed";

import { ReactNode } from "react";

export const metadata = {
  title: "Airconcare - Client Dashboard",
  description: "View and manage your AC service contracts.",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

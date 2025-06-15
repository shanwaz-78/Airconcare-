import { Inter } from "next/font/google";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main>{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

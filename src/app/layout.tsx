import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SE7EN CRM - Marketing",
  description: "CRM completo para a agência SE7EN Marketing",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-gray-100`}>

        {/* 👇 ESTRUTURA PRINCIPAL DO SITE */}
        <div className="flex flex-col md:flex-row min-h-screen">

          {/* SIDEBAR VAI ENTRAR AQUI DEPOIS (PASSO 2) */}

          {/* CONTEÚDO PRINCIPAL */}
          <main className="flex-1 w-full min-w-0 overflow-x-hidden">
            {children}
          </main>

        </div>

        <Toaster position="top-right" richColors />

      </body>
    </html>
  )
}
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Briefcase,
  FileText,
  DollarSign,
  Mail,
  Settings,
  LogOut,
  Target,
  Calendar,
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },

  { href: "/dashboard/leads", label: "Leads", icon: Target },

  { href: "/dashboard/clientes", label: "Clientes", icon: Users },

{ href: "/dashboard/agenda", label: "Calendário", icon: Calendar },

  { href: "/dashboard/tarefas", label: "Tarefas", icon: CheckSquare },

  { href: "/dashboard/projetos", label: "Projetos", icon: Briefcase },

  { href: "/dashboard/propostas", label: "Propostas", icon: FileText },

  { href: "/dashboard/vendas", label: "Vendas", icon: DollarSign },

  { href: "/dashboard/emails", label: "Emails", icon: Mail },

  { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings },
]
export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl">
      <div className="flex items-center justify-center h-20 border-b border-border px-4">
        <Logo size="md" />
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}

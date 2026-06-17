"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getInitials } from "@/lib/utils"

export function Topbar() {
  const [nome, setNome] = useState("Usuário")
  const supabase = createClient()

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: perfil } = await supabase
          .from("usuarios")
          .select("nome")
          .eq("id", user.id)
          .single()
        if (perfil) setNome(perfil.nome)
      }
    }
    loadUser()
  }, [supabase])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/50 backdrop-blur-xl px-6">
      {/* Busca */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes, tarefas..."
          className="pl-10 bg-background/50 border-border focus:border-primary"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* Notificações */}
        <button className="relative p-2 rounded-lg hover:bg-accent/50 transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-gold-gradient text-black font-semibold">
              {getInitials(nome)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground">{nome}</p>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
        </div>
      </div>
    </header>
  )
}




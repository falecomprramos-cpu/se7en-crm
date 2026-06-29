"use client"


import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, Briefcase, Save, Building2 } from "lucide-react"
import { getInitials } from "@/lib/utils"
import { toast } from "sonner"

export default function ConfiguracoesPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [perfil, setPerfil] = useState<any>({
    nome: "",
    email: "",
    cargo: "",
    telefone: "",
    role: "membro",
  })

  useEffect(() => {
    loadPerfil()
  }, [])

  async function loadPerfil() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (data) {
        setPerfil(data)
      } else if (user) {
        // Se não tem perfil, usa dados do auth
        setPerfil({
          nome: user.user_metadata?.nome || user.email?.split("@")[0],
          email: user.email,
          cargo: "",
          telefone: "",
          role: "membro",
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          email: user.email,
          nome: perfil.nome,
          cargo: perfil.cargo,
          telefone: perfil.telefone,
          role: perfil.role,
          ativo: true,
        })

      if (error) throw error
      toast.success("Ã¢Å“â€¦ Configurações salvas!")
    } catch (error: any) {
      toast.error("Erro: " + error.message)
    } finally {
      setSalvando(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Carregando...</div>
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações salvas!</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie seu perfil e preferências
        </p>
      </div>

      {/* Perfil */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Perfil
          </CardTitle>
          <CardDescription>
            Suas Informações pessoais e profissionais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={salvar} className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary/30">
                <AvatarFallback className="bg-gold-gradient text-black text-2xl font-bold">
                  {getInitials(perfil.nome || "U")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {perfil.nome}
                </h3>
                <p className="text-sm text-muted-foreground">{perfil.email}</p>
                <Badge className="mt-1 bg-primary/10 text-primary">
                  {perfil.role}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-primary" />
                  Nome completo
                </Label>
                <Input
                  value={perfil.nome}
                  onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Briefcase className="h-3.5 w-3.5 text-primary" />
                  Cargo
                </Label>
                <Input
                  value={perfil.cargo || ""}
                  onChange={(e) => setPerfil({ ...perfil, cargo: e.target.value })}
                  placeholder="Ex: Gestor de Tráfego"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  E-mail
                </Label>
                <Input value={perfil.email} disabled className="bg-muted/30" />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  Telefone
                </Label>
                <Input
                  value={perfil.telefone || ""}
                  onChange={(e) => setPerfil({ ...perfil, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={salvando}
                className="bg-gold-gradient text-black font-semibold gold-glow"
              >
                <Save className="h-4 w-4 mr-2" />
                {salvando ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info do sistema */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Sobre o Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Versão:</span>
            <span className="text-foreground">SE7EN CRM 1.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Plataforma:</span>
            <span className="text-foreground">Next.js + Supabase</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <Badge className="bg-green-500/10 text-green-500">?? Online</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}




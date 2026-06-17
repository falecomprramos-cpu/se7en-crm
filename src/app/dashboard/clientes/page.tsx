"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Phone, Mail, Edit, Trash2, Building2, MessageCircle, DollarSign } from "lucide-react"
import { formatCurrency, getInitials, statusColors, statusLabels } from "@/lib/utils"
import { toast } from "sonner"
import { ClienteDialog } from "@/components/clientes/cliente-dialog"

export default function ClientesPage() {
  const supabase = createClient()
  const [clientes, setClientes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState("")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editando, setEditando] = useState<any>(null)

  useEffect(() => {
    loadClientes()
  }, [])

  async function loadClientes() {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("criado_em", { ascending: false })
      if (error) throw error
      setClientes(data || [])
    } catch (error: any) {
      toast.error("Erro ao carregar")
    } finally {
      setLoading(false)
    }
  }

  function novoCliente() {
    setEditando(null)
    setDialogOpen(true)
  }

  function editarCliente(cliente: any) {
    setEditando(cliente)
    setDialogOpen(true)
  }

  async function excluirCliente(id: string) {
    if (!confirm("Excluir este cliente?")) return
    try {
      const { error } = await supabase.from("clientes").delete().eq("id", id)
      if (error) throw error
      toast.success("Cliente excluído!")
      loadClientes()
    } catch (error) {
      toast.error("Erro ao excluir")
    }
  }

  const clientesFiltrados = clientes.filter((c) => {
    const matchBusca =
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.empresa?.toLowerCase().includes(busca.toLowerCase()) ||
      c.email?.toLowerCase().includes(busca.toLowerCase())
    const matchStatus = filtroStatus === "todos" || c.status === filtroStatus
    return matchBusca && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground mt-1">
            {clientes.length} cliente(s) cadastrado(s)
          </p>
        </div>
        <Button
          onClick={novoCliente}
          className="bg-gold-gradient text-black font-semibold hover:opacity-90 gold-glow"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <ClienteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        cliente={editando}
        onSuccess={loadClientes}
      />

      {/* Filtros */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, empresa ou email..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10 bg-background/50 border-border focus:border-primary"
              />
            </div>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="bg-background/50 border-border focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">📊 Todos os status</SelectItem>
                <SelectItem value="lead">🔵 Lead</SelectItem>
                <SelectItem value="proposta">🟡 Proposta</SelectItem>
                <SelectItem value="ativo">🟢 Ativo</SelectItem>
                <SelectItem value="pausado">🟠 Pausado</SelectItem>
                <SelectItem value="churn">🔴 Churn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando...</div>
      ) : clientesFiltrados.length === 0 ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-4">Nenhum cliente encontrado.</p>
            <Button onClick={novoCliente} className="bg-gold-gradient text-black">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar primeiro cliente
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientesFiltrados.map((cliente) => (
            <Card
              key={cliente.id}
              className="card-hover border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/30">
                      <AvatarFallback className="bg-gold-gradient text-black font-bold">
                        {getInitials(cliente.nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{cliente.nome}</h3>
                      {cliente.empresa && (
                        <p className="text-xs text-muted-foreground">{cliente.empresa}</p>
                      )}
                    </div>
                  </div>
                  <Badge className={statusColors[cliente.status]}>
                    {statusLabels[cliente.status]}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  {cliente.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{cliente.email}</span>
                    </div>
                  )}
                  {cliente.telefone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {cliente.telefone}
                    </div>
                  )}
                  {cliente.whatsapp && (
                    <div className="flex items-center gap-2 text-green-500">
                      <MessageCircle className="h-3 w-3" />
                      {cliente.whatsapp}
                    </div>
                  )}
                </div>

                {cliente.valor_mensal > 0 && (
                  <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Valor mensal</span>
                    <span className="text-lg font-bold text-gold">
                      {formatCurrency(cliente.valor_mensal)}
                    </span>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editarCliente(cliente)}
                    className="flex-1 border-border hover:border-primary/50 hover:bg-primary/5"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => excluirCliente(cliente.id)}
                    className="border-border hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}




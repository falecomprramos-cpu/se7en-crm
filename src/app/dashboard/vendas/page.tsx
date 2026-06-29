"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, DollarSign, Edit, Trash2, TrendingUp, Calendar, X } from "lucide-react"
import { formatCurrency, formatDate, statusColors, statusLabels } from "@/lib/utils"
import { toast } from "sonner"

export default function VendasPage() {
  const supabase = createClient()
  const [vendas, setVendas] = useState<any[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  const [servicos, setServicos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editando, setEditando] = useState<any>(null)

  const [form, setForm] = useState({
    cliente_id: "",
    servico_id: "",
    descricao: "",
    valor: 0,
    recorrencia: "mensal",
    data_venda: new Date().toISOString().split("T")[0],
    data_inicio: "",
    data_fim: "",
    status: "ativo",
    observacoes: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [vendasRes, clientesRes, servicosRes] = await Promise.all([
        supabase
          .from("vendas")
          .select("*, cliente:clientes(nome, empresa), servico:servicos(nome)")
          .order("data_venda", { ascending: false }),
        supabase.from("clientes").select("id, nome, empresa").order("nome"),
        supabase.from("servicos").select("id, nome, preco_base").eq("ativo", true),
      ])
      setVendas(vendasRes.data || [])
      setClientes(clientesRes.data || [])
      setServicos(servicosRes.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  function novaVenda() {
    setEditando(null)
    setForm({
      cliente_id: "",
      servico_id: "",
      descricao: "",
      valor: 0,
      recorrencia: "mensal",
      data_venda: new Date().toISOString().split("T")[0],
      data_inicio: "",
      data_fim: "",
      status: "ativo",
      observacoes: "",
    })
    setDialogOpen(true)
  }

  function editarVenda(venda: any) {
    setEditando(venda)
    setForm({
      cliente_id: venda.cliente_id || "",
      servico_id: venda.servico_id || "",
      descricao: venda.descricao || "",
      valor: venda.valor,
      recorrencia: venda.recorrencia,
      data_venda: venda.data_venda,
      data_inicio: venda.data_inicio || "",
      data_fim: venda.data_fim || "",
      status: venda.status,
      observacoes: venda.observacoes || "",
    })
    setDialogOpen(true)
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!form.cliente_id) {
      toast.error("Selecione um cliente")
      return
    }
    try {
      const data = {
        ...form,
        servico_id:
  form.servico_id === "nenhum" ? null : form.servico_id || null,

data_inicio: form.data_inicio || null,
data_fim: form.data_fim || null,
      }
      if (editando) {
        const { error } = await supabase.from("vendas").update(data).eq("id", editando.id)
        if (error) throw error
        toast.success("💰 Venda atualizada!")
      } else {
        const { error } = await supabase.from("vendas").insert([data])
        if (error) throw error
        toast.success("💰 Venda registrada!")
      }
      setDialogOpen(false)
      loadData()
    } catch (error: any) {
      toast.error("Erro: " + error.message)
    }
  }

  async function excluir(id: string) {
    if (!confirm("Excluir esta venda?")) return
    await supabase.from("vendas").delete().eq("id", id)
    toast.success("Venda excluída!")
    loadData()
  }

  // Stats
  const totalReceita = vendas
    .filter((v) => v.status === "ativo")
    .reduce((acc, v) => {
      if (v.recorrencia === "mensal") return acc + v.valor
      if (v.recorrencia === "unico") return acc + v.valor
      return acc + v.valor / 12
    }, 0)

  const vendasAtivas = vendas.filter((v) => v.status === "ativo").length
  const ticketMedio = vendasAtivas > 0 ? totalReceita / vendasAtivas : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendas</h1>
          <p className="text-muted-foreground mt-1">
            {vendas.length} venda(s) registrada(s)
          </p>
        </div>
        <Button
          onClick={novaVenda}
          className="bg-gold-gradient text-black font-semibold hover:opacity-90 gold-glow"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Venda
        </Button>
      </div>

      {/* Cards de Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receita Mensal</p>
                <p className="text-2xl font-bold text-gold mt-1">
                  {formatCurrency(totalReceita)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vendas Ativas</p>
                <p className="text-2xl font-bold text-green-500 mt-1">{vendasAtivas}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-bold text-blue-500 mt-1">
                  {formatCurrency(ticketMedio)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-card via-card to-blue-950/50 border-primary/30">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold-gradient">
                <DollarSign className="h-5 w-5 text-black" />
              </div>
              <DialogTitle className="text-2xl font-bold text-foreground">
                {editando ? "Editar Venda" : "Nova Venda"}
              </DialogTitle>
            </div>
          </DialogHeader>
          <form onSubmit={salvar} className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cliente *</Label>
                <Select
                  value={form.cliente_id}
                  onValueChange={(v) => setForm({ ...form, cliente_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nome} {c.empresa && `(${c.empresa})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Serviço</Label>
                <Select
                  value={form.servico_id}
                  onValueChange={(v) => {
                    const serv = servicos.find((s) => s.id === v)
                    setForm({
                      ...form,
                      servico_id: v,
                      valor: serv?.preco_base || form.valor,
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nenhum">Nenhum</SelectItem>
                    {servicos.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.nome} - {formatCurrency(s.preco_base || 0)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Valor (R$) *</Label>
                <Input
                  type="number"
                  value={form.valor}
                  onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Recorrência</Label>
                <Select
                  value={form.recorrencia}
                  onValueChange={(v) => setForm({ ...form, recorrencia: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unico">Único</SelectItem>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                    <SelectItem value="semestral">Semestral</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data da venda</Label>
                <Input
                  type="date"
                  value={form.data_venda}
                  onChange={(e) => setForm({ ...form, data_venda: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm({ ...form, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">🟢 Ativo</SelectItem>
                    <SelectItem value="pausado">🟠 Pausado</SelectItem>
                    <SelectItem value="cancelado">🔴 Cancelado</SelectItem>
                    <SelectItem value="finalizado">⚫ Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                rows={2}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-gold-gradient text-black font-semibold gold-glow"
              >
                Salvar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lista */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando...</div>
      ) : vendas.length === 0 ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="text-center py-12">
            <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nenhuma venda registrada.</p>
            <Button onClick={novaVenda} className="mt-4 bg-gold-gradient text-black">
              <Plus className="mr-2 h-4 w-4" />
              Registrar primeira venda
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {vendas.map((venda) => (
            <Card
              key={venda.id}
              className="card-hover border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gold-gradient flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-black" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {venda.cliente?.nome || "Cliente removido"}
                      </h3>
                      {venda.cliente?.empresa && (
                        <span className="text-xs text-muted-foreground">
                          • {venda.cliente.empresa}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      {venda.servico?.nome && <span>📦 {venda.servico.nome}</span>}
                      <span>📅 {formatDate(venda.data_venda)}</span>
                      <span>🔄 {venda.recorrencia}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gold">
                      {formatCurrency(venda.valor)}
                    </p>
                    <Badge className={statusColors[venda.status]}>
                      {statusLabels[venda.status]}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => editarVenda(venda)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => excluir(venda.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import { Plus, Briefcase, Edit, Trash2, X, Calendar } from "lucide-react"
import { formatCurrency, formatDate, statusLabels } from "@/lib/utils"
import { toast } from "sonner"

const COLUNAS = [
  { id: "planejamento", label: "Planejamento", color: "border-blue-500", bg: "bg-blue-500/10" },
  { id: "em_andamento", label: "Em Andamento", color: "border-green-500", bg: "bg-green-500/10" },
  { id: "pausado", label: "Pausado", color: "border-orange-500", bg: "bg-orange-500/10" },
  { id: "concluido", label: "Concluído", color: "border-gray-500", bg: "bg-gray-500/10" },
]

export default function ProjetosPage() {
  const supabase = createClient()
  const [projetos, setProjetos] = useState<any[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  const [servicos, setServicos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editando, setEditando] = useState<any>(null)
  const [draggedId, setDraggedId] = useState<string | null>(null)

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    cliente_id: "",
    servico_id: "",
    status: "planejamento",
    data_inicio: "",
    data_prazo: "",
    valor: 0,
    progresso: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [projRes, cliRes, servRes] = await Promise.all([
        supabase
          .from("projetos")
          .select("*, cliente:clientes(nome, empresa), servico:servicos(nome)")
          .order("criado_em", { ascending: false }),
        supabase.from("clientes").select("id, nome").order("nome"),
        supabase.from("servicos").select("id, nome, preco_base").eq("ativo", true),
      ])
      setProjetos(projRes.data || [])
      setClientes(cliRes.data || [])
      setServicos(servRes.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  function novoProjeto() {
    setEditando(null)
    setForm({
      nome: "",
      descricao: "",
      cliente_id: "",
      servico_id: "",
      status: "planejamento",
      data_inicio: "",
      data_prazo: "",
      valor: 0,
      progresso: 0,
    })
    setDialogOpen(true)
  }

  function editarProjeto(p: any) {
    setEditando(p)
    setForm({
      nome: p.nome,
      descricao: p.descricao || "",
      cliente_id: p.cliente_id,
      servico_id: p.servico_id || "",
      status: p.status,
      data_inicio: p.data_inicio || "",
      data_prazo: p.data_prazo || "",
      valor: p.valor || 0,
      progresso: p.progresso || 0,
    })
    setDialogOpen(true)
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome || !form.cliente_id) {
      toast.error("Nome e cliente são obrigatórios")
      return
    }
    try {
      const data = {
        ...form,
        servico_id: form.servico_id || null,
        data_inicio: form.data_inicio || null,
        data_prazo: form.data_prazo || null,
      }
      if (editando) {
        await supabase.from("projetos").update(data).eq("id", editando.id)
        toast.success("Projeto atualizado!")
      } else {
        await supabase.from("projetos").insert([data])
        toast.success("Projeto criado!")
      }
      setDialogOpen(false)
      loadData()
    } catch (error: any) {
      toast.error("Erro: " + error.message)
    }
  }

  async function excluir(id: string) {
    if (!confirm("Excluir este projeto?")) return
    await supabase.from("projetos").delete().eq("id", id)
    toast.success("Projeto excluído!")
    loadData()
  }

  // Drag and Drop
  async function handleDrop(status: string) {
    if (draggedId) {
      await supabase
        .from("projetos")
        .update({ status })
        .eq("id", draggedId)
      setDraggedId(null)
      loadData()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projetos</h1>
          <p className="text-muted-foreground mt-1">
            {projetos.length} projeto(s) • Kanban de andamento
          </p>
        </div>
        <Button
          onClick={novoProjeto}
          className="bg-gold-gradient text-black font-semibold hover:opacity-90 gold-glow"
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUNAS.map((coluna) => {
          const projColuna = projetos.filter((p) => p.status === coluna.id)
          return (
            <div
              key={coluna.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(coluna.id)}
              className={`rounded-xl border-2 ${coluna.color} ${coluna.bg} p-3 min-h-[500px]`}
            >
              <div className="flex items-center justify-between mb-3 px-2">
                <h3 className="font-semibold text-foreground">{coluna.label}</h3>
                <Badge variant="secondary" className="bg-background/50">
                  {projColuna.length}
                </Badge>
              </div>

              <div className="space-y-2">
                {projColuna.map((p) => (
                  <Card
                    key={p.id}
                    draggable
                    onDragStart={() => setDraggedId(p.id)}
                    onDragEnd={() => setDraggedId(null)}
                    className="card-hover border-border/50 bg-card cursor-move"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm text-foreground">{p.nome}</h4>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => editarProjeto(p)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        📁 {p.cliente?.nome}
                      </p>
                      {p.servico?.nome && (
                        <p className="text-xs text-primary mb-2">📦 {p.servico.nome}</p>
                      )}
                      {p.data_prazo && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                          <Calendar className="h-3 w-3" />
                          {formatDate(p.data_prazo)}
                        </p>
                      )}
                      {p.valor > 0 && (
                        <p className="text-sm font-bold text-gold mb-2">
                          {formatCurrency(p.valor)}
                        </p>
                      )}
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progresso</span>
                          <span className="text-foreground font-medium">
                            {p.progresso}%
                          </span>
                        </div>
                        <Progress value={p.progresso} className="h-1" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {projColuna.length === 0 && (
                  <div className="text-center py-8 text-xs text-muted-foreground border-2 border-dashed border-border/30 rounded-lg">
                    Arraste projetos aqui
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-card via-card to-blue-950/50 border-primary/30">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold-gradient">
                <Briefcase className="h-5 w-5 text-black" />
              </div>
              <DialogTitle className="text-2xl font-bold text-foreground">
                {editando ? "Editar Projeto" : "Novo Projeto"}
              </DialogTitle>
            </div>
          </DialogHeader>
          <form onSubmit={salvar} className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
            <div className="space-y-2">
              <Label>Nome do projeto *</Label>
              <Input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Campanha de Tráfego - Cliente X"
                required
              />
            </div>
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
                        {c.nome}
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
                        {s.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data início</Label>
                <Input
                  type="date"
                  value={form.data_inicio}
                  onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Prazo final</Label>
                <Input
                  type="date"
                  value={form.data_prazo}
                  onChange={(e) => setForm({ ...form, data_prazo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Valor (R$)</Label>
                <Input
                  type="number"
                  value={form.valor}
                  onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
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
                    <SelectItem value="planejamento">🔵 Planejamento</SelectItem>
                    <SelectItem value="em_andamento">🟢 Em Andamento</SelectItem>
                    <SelectItem value="pausado">🟠 Pausado</SelectItem>
                    <SelectItem value="concluido">⚫ Concluído</SelectItem>
                    <SelectItem value="cancelado">🔴 Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Progresso: {form.progresso}%</Label>
              <Input
                type="range"
                min="0"
                max="100"
                value={form.progresso}
                onChange={(e) => setForm({ ...form, progresso: Number(e.target.value) })}
                className="cursor-pointer"
              />
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
    </div>
  )
}




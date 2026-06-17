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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Plus, FileText, Edit, Trash2, X, Download } from "lucide-react"
import { formatCurrency, formatDate, statusLabels, statusColors } from "@/lib/utils"
import { toast } from "sonner"
import jsPDF from "jspdf"

export default function PropostasPage() {
  const supabase = createClient()
  const [propostas, setPropostas] = useState<any[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  const [servicos, setServicos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editando, setEditando] = useState<any>(null)

  const [form, setForm] = useState({
    titulo: "", descricao: "", cliente_id: "", servicos: [] as any[],
    valor_total: 0, validade: "", status: "rascunho", observacoes: "",
  })

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [propRes, cliRes, servRes] = await Promise.all([
        supabase.from("propostas").select("*, cliente:clientes(nome, empresa, email)").order("criado_em", { ascending: false }),
        supabase.from("clientes").select("id, nome, email, empresa").order("nome"),
        supabase.from("servicos").select("id, nome, preco_base, descricao").eq("ativo", true),
      ])
      setPropostas(propRes.data || [])
      setClientes(cliRes.data || [])
      setServicos(servRes.data || [])
    } catch (error) { console.error(error) } finally { setLoading(false) }
  }

  function novaProposta() {
    setEditando(null)
    setForm({ titulo: "", descricao: "", cliente_id: "", servicos: [], valor_total: 0, validade: "", status: "rascunho", observacoes: "" })
    setDialogOpen(true)
  }

  function editarProposta(p: any) {
    setEditando(p)
    setForm({
      titulo: p.titulo, descricao: p.descricao || "", cliente_id: p.cliente_id,
      servicos: p.servicos || [], valor_total: p.valor_total, validade: p.validade || "",
      status: p.status, observacoes: p.observacoes || "",
    })
    setDialogOpen(true)
  }

  function toggleServico(servico: any) {
    const jaAdicionado = form.servicos.find((s: any) => s.id === servico.id)
    let novosServicos
    if (jaAdicionado) {
      novosServicos = form.servicos.filter((s: any) => s.id !== servico.id)
    } else {
      novosServicos = [...form.servicos, { id: servico.id, nome: servico.nome, preco: servico.preco_base }]
    }
    const novoTotal = novosServicos.reduce((acc: number, s: any) => acc + (s.preco || 0), 0)
    setForm({ ...form, servicos: novosServicos, valor_total: novoTotal })
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!form.titulo || !form.cliente_id) { toast.error("Título e cliente são obrigatórios"); return }
    try {
      const data = { ...form, validade: form.validade || null }
      if (editando) {
        await supabase.from("propostas").update(data).eq("id", editando.id)
        toast.success("Proposta atualizada!")
      } else {
        await supabase.from("propostas").insert([data])
        toast.success("Proposta criada!")
      }
      setDialogOpen(false)
      loadData()
    } catch (error: any) { toast.error("Erro: " + error.message) }
  }

  async function excluir(id: string) {
    if (!confirm("Excluir esta proposta?")) return
    await supabase.from("propostas").delete().eq("id", id)
    toast.success("Proposta excluída!")
    loadData()
  }

  function gerarPDF(proposta: any) {
    const doc = new jsPDF()
    const cliente = proposta.cliente
    doc.setFillColor(10, 22, 40)
    doc.rect(0, 0, 210, 40, "F")
    doc.setTextColor(212, 175, 55)
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text("SE7EN MARKETING", 20, 20)
    doc.setFontSize(10)
    doc.setTextColor(255, 255, 255)
    doc.text("Proposta Comercial", 20, 30)
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(18)
    doc.text(proposta.titulo, 20, 60)
    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`Cliente: ${cliente?.nome || "N/A"}`, 20, 75)
    if (cliente?.empresa) doc.text(`Empresa: ${cliente.empresa}`, 20, 82)
    if (cliente?.email) doc.text(`E-mail: ${cliente.email}`, 20, 89)
    doc.text(`Data: ${formatDate(proposta.criado_em)}`, 140, 75)
    if (proposta.validade) doc.text(`Validade: ${formatDate(proposta.validade)}`, 140, 82)
    doc.setDrawColor(212, 175, 55)
    doc.setLineWidth(0.5)
    doc.line(20, 100, 190, 100)
    if (proposta.descricao) {
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("Descricao", 20, 115)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      const lines = doc.splitTextToSize(proposta.descricao, 170)
      doc.text(lines, 20, 122)
    }
    let y = proposta.descricao ? 145 : 115
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("Servicos Inclusos", 20, y)
    y += 10
    if (proposta.servicos && proposta.servicos.length > 0) {
      proposta.servicos.forEach((s: any) => {
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.text("- " + s.nome, 25, y)
        doc.text(formatCurrency(s.preco || 0), 160, y)
        y += 7
      })
    }
    y += 10
    doc.setDrawColor(212, 175, 55)
    doc.line(20, y, 190, y)
    y += 10
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.text("VALOR TOTAL:", 20, y)
    doc.setTextColor(212, 175, 55)
    doc.text(formatCurrency(proposta.valor_total), 160, y)
    doc.save(`Proposta-${proposta.titulo.replace(/\s/g, "-")}.pdf`)
    toast.success("PDF gerado!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Propostas</h1>
          <p className="text-muted-foreground mt-1">{propostas.length} proposta(s)</p>
        </div>
        <Button onClick={novaProposta} className="bg-gold-gradient text-black font-semibold hover:opacity-90 gold-glow">
          <Plus className="mr-2 h-4 w-4" />Nova Proposta
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl bg-gradient-to-br from-card via-card to-blue-950/50 border-primary/30">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold-gradient">
                <FileText className="h-5 w-5 text-black" />
              </div>
              <DialogTitle className="text-2xl font-bold text-foreground">
                {editando ? "Editar Proposta" : "Nova Proposta"}
              </DialogTitle>
            </div>
          </DialogHeader>
          <form onSubmit={salvar} className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
            <div className="space-y-2">
              <Label>Titulo *</Label>
              <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cliente *</Label>
                <Select value={form.cliente_id} onValueChange={(v) => setForm({ ...form, cliente_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {clientes.map((c) => (<SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Validade</Label>
                <Input type="date" value={form.validade} onChange={(e) => setForm({ ...form, validade: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Valor Total (R$) *</Label>
              <Input type="number" value={form.valor_total} onChange={(e) => setForm({ ...form, valor_total: Number(e.target.value) })} required className="text-lg font-bold" />
            </div>
            <div className="space-y-2">
              <Label>Descricao</Label>
              <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="rascunho">Rascunho</SelectItem>
                  <SelectItem value="enviada">Enviada</SelectItem>
                  <SelectItem value="aceita">Aceita</SelectItem>
                  <SelectItem value="recusada">Recusada</SelectItem>
                  <SelectItem value="expirada">Expirada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" className="bg-gold-gradient text-black font-semibold gold-glow">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando...</div>
      ) : propostas.length === 0 ? (
        <Card className="border-border/50 bg-card/50">
          <CardContent className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nenhuma proposta criada.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {propostas.map((p) => (
            <Card key={p.id} className="card-hover border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{p.titulo}</h3>
                  <Badge className={statusColors[p.status]}>{statusLabels[p.status]}</Badge>
                </div>
                <p className="text-2xl font-bold text-gold my-3">{formatCurrency(p.valor_total)}</p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={() => gerarPDF(p)} className="flex-1">
                    <Download className="h-3 w-3 mr-1" />PDF
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => editarProposta(p)} className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />Editar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => excluir(p.id)} className="text-destructive">
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




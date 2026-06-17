"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User, Building2, Mail, Phone, MessageCircle, DollarSign, Tag, FileText, X } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

interface ClienteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente?: any
  onSuccess: () => void
}

export function ClienteDialog({ open, onOpenChange, cliente, onSuccess }: ClienteDialogProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: "",
    empresa: "",
    email: "",
    telefone: "",
    whatsapp: "",
    status: "lead",
    valor_mensal: 0,
    origem: "outro",
    segmento: "",
    observacoes: "",
  })

  useEffect(() => {
    if (cliente) {
      setForm({
        nome: cliente.nome || "",
        empresa: cliente.empresa || "",
        email: cliente.email || "",
        telefone: cliente.telefone || "",
        whatsapp: cliente.whatsapp || "",
        status: cliente.status || "lead",
        valor_mensal: cliente.valor_mensal || 0,
        origem: cliente.origem || "outro",
        segmento: cliente.segmento || "",
        observacoes: cliente.observacoes || "",
      })
    } else {
      setForm({
        nome: "",
        empresa: "",
        email: "",
        telefone: "",
        whatsapp: "",
        status: "lead",
        valor_mensal: 0,
        origem: "outro",
        segmento: "",
        observacoes: "",
      })
    }
  }, [cliente, open])

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome.trim()) {
      toast.error("Nome é obrigatório")
      return
    }
    setLoading(true)
    try {
      if (cliente) {
        const { error } = await supabase.from("clientes").update(form).eq("id", cliente.id)
        if (error) throw error
        toast.success("✨ Cliente atualizado!")
      } else {
        const { error } = await supabase.from("clientes").insert([form])
        if (error) throw error
        toast.success("✨ Cliente criado!")
      }
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error("Erro: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-card via-card to-blue-950/50 border-primary/30 shadow-2xl shadow-primary/20 p-0 overflow-hidden">
        {/* Header com gradiente dourado */}
        <div className="relative bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-6 border-b border-primary/20">
          <div className="absolute inset-0 bg-gold-gradient opacity-5" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gold-gradient">
                <User className="h-5 w-5 text-black" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-foreground">
                  {cliente ? "Editar Cliente" : "Novo Cliente"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {cliente ? "Atualize as informações" : "Adicione um novo cliente à sua carteira"}
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Form */}
        <form onSubmit={salvar} className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Nome e Empresa */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-primary" />
                Nome *
              </Label>
              <Input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="João Silva"
                required
                className="bg-background/50 border-border focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                Empresa
              </Label>
              <Input
                value={form.empresa}
                onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                placeholder="Empresa LTDA"
                className="bg-background/50 border-border focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Email e Telefone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary" />
                E-mail
              </Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="contato@empresa.com"
                className="bg-background/50 border-border focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary" />
                Telefone
              </Label>
              <Input
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                placeholder="(11) 99999-9999"
                className="bg-background/50 border-border focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* WhatsApp e Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <MessageCircle className="h-3.5 w-3.5 text-green-500" />
                WhatsApp
              </Label>
              <Input
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="(11) 99999-9999"
                className="bg-background/50 border-border focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setForm({ ...form, status: v })}
              >
                <SelectTrigger className="bg-background/50 border-border focus:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">🔵 Lead</SelectItem>
                  <SelectItem value="proposta">🟡 Proposta</SelectItem>
                  <SelectItem value="ativo">🟢 Ativo</SelectItem>
                  <SelectItem value="pausado">🟠 Pausado</SelectItem>
                  <SelectItem value="churn">🔴 Churn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Valor Mensal e Origem */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5 text-primary" />
                Valor Mensal (R$)
              </Label>
              <Input
                type="number"
                value={form.valor_mensal}
                onChange={(e) =>
                  setForm({ ...form, valor_mensal: Number(e.target.value) })
                }
                placeholder="1500"
                className="bg-background/50 border-border focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Origem</Label>
              <Select
                value={form.origem}
                onValueChange={(v) => setForm({ ...form, origem: v })}
              >
                <SelectTrigger className="bg-background/50 border-border focus:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indicacao">👥 Indicação</SelectItem>
                  <SelectItem value="site">🌐 Site</SelectItem>
                  <SelectItem value="instagram">📸 Instagram</SelectItem>
                  <SelectItem value="google">🔍 Google</SelectItem>
                  <SelectItem value="facebook">📘 Facebook</SelectItem>
                  <SelectItem value="outro">📌 Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Segmento */}
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-primary" />
              Segmento
            </Label>
            <Input
              value={form.segmento}
              onChange={(e) => setForm({ ...form, segmento: e.target.value })}
              placeholder="Ex: E-commerce, Saúde, Educação..."
              className="bg-background/50 border-border focus:border-primary focus:ring-1 focus:ring-primary/30"
            />
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-primary" />
              Observações
            </Label>
            <Textarea
              value={form.observacoes}
              onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
              rows={3}
              placeholder="Anotações importantes sobre o cliente..."
              className="bg-background/50 border-border focus:border-primary focus:ring-1 focus:ring-primary/30 resize-none"
            />
          </div>
        </form>

        {/* Footer com botões estilizados */}
        <div className="flex justify-end gap-3 p-6 border-t border-border bg-card/30">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border hover:border-primary/50"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={salvar}
            disabled={loading}
            className="bg-gold-gradient text-black font-semibold hover:opacity-90 gold-glow min-w-[140px]"
          >
            {loading ? "Salvando..." : cliente ? "Salvar Alterações" : "Criar Cliente"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}




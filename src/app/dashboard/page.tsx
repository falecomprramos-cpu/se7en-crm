"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, DollarSign, CheckSquare, TrendingUp, ArrowUpRight, Briefcase } from "lucide-react"
import { formatCurrency, getInitials } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"

export default function DashboardPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalClientes: 0,
    clientesAtivos: 0,
    receitaMensal: 0,
    tarefasPendentes: 0,
    projetosAtivos: 0,
    taxaConversao: 0,
  })
  const [clientesRecentes, setClientesRecentes] = useState<any[]>([])
  const [tarefasUrgentes, setTarefasUrgentes] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      try {
        const { count: totalClientes } = await supabase
          .from("clientes")
          .select("*", { count: "exact", head: true })

        const { count: clientesAtivos } = await supabase
          .from("clientes")
          .select("*", { count: "exact", head: true })
          .eq("status", "ativo")

        const { data: vendas } = await supabase
.from("vendas")
.select("valor")
.eq("status","ativo")


const receita = vendas?.reduce(
(acc,v)=>acc+(v.valor || 0),
0
) || 0

        const { count: tarefasPendentes } = await supabase
          .from("tarefas")
          .select("*", { count: "exact", head: true })
          .neq("status", "concluida")

        const { count: projetosAtivos } = await supabase
          .from("projetos")
          .select("*", { count: "exact", head: true })
          .eq("status", "em_andamento")

        const { count: leads } = await supabase
          .from("clientes")
          .select("*", { count: "exact", head: true })
          .eq("status", "lead")
        const taxa = leads && leads > 0 ? Math.round((clientesAtivos! / leads) * 100) : 0

        setStats({
          totalClientes: totalClientes || 0,
          clientesAtivos: clientesAtivos || 0,
          receitaMensal: receita,
          tarefasPendentes: tarefasPendentes || 0,
          projetosAtivos: projetosAtivos || 0,
          taxaConversao: taxa,
        })

        const { data: recentes } = await supabase
          .from("clientes")
          .select("*")
          .order("created_at", { ascending:false })
          .limit(5)
        setClientesRecentes(recentes || [])

        const { data: tarefas } = await supabase
.from("tarefas")
.select("*")
.in("prioridade", ["Alta","Urgente"])
.neq("status","Concluída")
.order("data_limite",{ascending:true})
.limit(5)
        setTarefasUrgentes(tarefas || [])
      } catch (error) {
  console.error("Erro ao carregar dados:", error)
  alert(JSON.stringify(error))
} finally {
        setLoading(false)
      }
    }
    loadData()
  }, [supabase])

  const cards = [
    {
      title: "Total de Clientes",
      value: stats.totalClientes,
      icon: Users,
      color: "from-blue-500 to-blue-700",
      href: "/dashboard/clientes",
    },
    {
      title: "Clientes Ativos",
      value: stats.clientesAtivos,
      icon: TrendingUp,
      color: "from-green-500 to-green-700",
      href: "/dashboard/clientes?status=ativo",
    },
    {
      title: "Receita Mensal",
      value: formatCurrency(stats.receitaMensal),
      icon: DollarSign,
      color: "from-yellow-500 to-yellow-700",
      href: "/dashboard/vendas",
    },
    {
      title: "Projetos Ativos",
      value: stats.projetosAtivos,
      icon: Briefcase,
      color: "from-purple-500 to-purple-700",
      href: "/dashboard/projetos",
    },
    {
      title: "Tarefas Pendentes",
      value: stats.tarefasPendentes,
      icon: CheckSquare,
      color: "from-orange-500 to-orange-700",
      href: "/dashboard/tarefas",
    },
    {
      title: "Taxa de Conversao",
      value: stats.taxaConversao + "%",
      icon: ArrowUpRight,
      color: "from-pink-500 to-pink-700",
      href: "/dashboard/clientes",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-1 w-32 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4 animate-pulse" />
          <p className="text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bem-vindo de volta!</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie clientes, projetos e oportunidades da SE7EN Marketing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${card.color} bg-opacity-10`}>
                    <card.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {card.value}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Clientes Recentes</CardTitle>
            <CardDescription>Ultimos clientes cadastrados</CardDescription>
          </CardHeader>
          <CardContent>
            {clientesRecentes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum cliente cadastrado.</p>
            ) : (
              <div className="space-y-4">
                {clientesRecentes.map((cliente) => (
                  <div key={cliente.id} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {getInitials(cliente.nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {cliente.nome}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {cliente.email}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {cliente.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Tarefas Urgentes</CardTitle>
            <CardDescription>Tarefas de alta prioridade</CardDescription>
          </CardHeader>
          <CardContent>
            {tarefasUrgentes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma tarefa urgente.</p>
            ) : (
              <div className="space-y-4">
                {tarefasUrgentes.map((tarefa) => (
                  <div key={tarefa.id} className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${tarefa.prioridade === "urgente" ? "bg-red-500" : "bg-orange-500"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {tarefa.titulo}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tarefa.cliente?.nome || "Sem cliente"}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {tarefa.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

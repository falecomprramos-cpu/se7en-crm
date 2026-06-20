"use client"

import LeadsDashboard from "@/components/dashboard/LeadsDashboard"
import LeadsKanban from "@/components/dashboard/LeadsKanban"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  Plus
} from "lucide-react"

import { toast } from "sonner"

export default function LeadsPage() {

  const supabase = createClient()

  const [leads, setLeads] = useState<any[]>([])
  const [nome, setNome] = useState("")
const [empresa, setEmpresa] = useState("")
const [whatsapp, setWhatsapp] = useState("")
const [instagram, setInstagram] = useState("")
const [segmento, setSegmento] = useState("")
const [origem, setOrigem] = useState("")
  const [filtro, setFiltro] = useState("todos")

  useEffect(() => {
    buscarLeads()
  }, [])

  async function buscarLeads() {
    const { data, error } = await supabase
      .from("leads")
      .select("*")

    if (error) {
      toast.error(error.message)
      return
    }

    setLeads(data || [])
  }

  async function salvarLead() {
    if (!nome) {
      toast.error("Digite o nome do lead")
      return
    }

    const { error } = await supabase
      .from("leads")
      .insert({
  nome,
  empresa,
  whatsapp,
  instagram,
  segmento,
  origem,
  status: "novo",
  etapa: "novo"
})

    if (error) {
      toast.error(error.message)
      return
    }

    toast.success("Lead criado")

    setNome("")
setEmpresa("")
setWhatsapp("")
setInstagram("")
setSegmento("")
setOrigem("")

    buscarLeads()
  }

  async function atualizarStatus(
id:string,
status:string
){


console.log("TENTANDO ALTERAR")

console.log({
id,
status
})


const {data: encontrado, error: erroBusca} = await supabase
.from("leads")
.select("id,nome,status")
.eq("id", id)
.single()


console.log("LEAD ENCONTRADO:", encontrado)


console.log("ERRO BUSCA:", erroBusca)



const {data,error}=await supabase
.from("leads")
.update({
  status: status,
  etapa: status
})
.eq("id", id)
.select()
.single()



console.log("SUPABASE DATA")
console.log(data)


console.log("SUPABASE ERROR")
console.log(error)



if(error){

toast.error(error.message)

return

}


toast.success("Alterado")


buscarLeads()


}

  async function deletarLead(id:string){


console.log("EXCLUINDO ID:",id)



const {data,error}=await supabase
.from("leads")
.delete()
.eq("id",id)
.select()
.single()



console.log("DELETE DATA",data)

console.log("DELETE ERROR",error)



if(error){

toast.error(error.message)

return

}


toast.success("Excluído")


buscarLeads()


}

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Leads</h1>
        <p className="text-muted-foreground">
          Gerencie seus clientes
        </p>
<LeadsDashboard leads={leads} />
      </div>

      {/* FORM */}
      <Card>
        <CardHeader>
          <CardTitle>Novo Lead</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          <Input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
<Input placeholder="Empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
<Input placeholder="WhatsApp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
<Input placeholder="Instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
<Input 
placeholder="Segmento" 
value={segmento} 
onChange={(e) => setSegmento(e.target.value)} 
/>


<select
  className="w-full p-2 border rounded"
  value={origem}
  onChange={(e) => setOrigem(e.target.value)}
>
  <option value="">Origem do lead</option>
  <option value="Instagram">Instagram</option>
  <option value="Indicação">Indicação</option>
  <option value="Anúncio">Anúncio</option>
  <option value="Site">Site</option>
</select>



          <Button onClick={salvarLead}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Lead
          </Button>

        </CardContent>
      </Card>

      {/* FILTRO */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => setFiltro("todos")}>Todos</Button>
        <Button onClick={() => setFiltro("novo")}>Novos</Button>
        <Button onClick={() => setFiltro("contato")}>Contato</Button>
        <Button onClick={() => setFiltro("proposta")}>Proposta</Button>
        <Button onClick={() => setFiltro("fechado")}>Fechado</Button>
        <Button onClick={() => setFiltro("perdido")}>Perdido</Button>
      </div>

      <LeadsKanban
  leads={leads}
  atualizarStatus={atualizarStatus}
  deletarLead={deletarLead}
/>

    </div>
  )
}
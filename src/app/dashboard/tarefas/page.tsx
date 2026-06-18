"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

import { Plus, CheckCircle, Clock, AlertTriangle } from "lucide-react"
import { toast } from "sonner"


export default function TarefasPage(){

const supabase = createClient()

const [tarefas,setTarefas] = useState<any[]>([])
const [open,setOpen] = useState(false)
const [editando,setEditando] = useState<any>(null)
const [filtro,setFiltro] = useState("todos")
const [form,setForm] = useState({

titulo:"",
descricao:"",
status:"pendente",
prioridade:"media",
data_vencimento:"",
})
<div>

<Label>
Prazo
</Label>


<Input
type="date"
value={form.data_vencimento}
onChange={(e)=>
setForm({
...form,
data_vencimento:e.target.value
})
}
/>

</div>

useEffect(()=>{

buscarTarefas()
async function concluirTarefa(id:string){

const {error}=await supabase
.from("tarefas")
.insert({
  titulo: form.titulo,
  descricao: form.descricao,
  status: form.status.toLowerCase(),
  prioridade: form.prioridade.toLowerCase(),
data_vencimento: form.data_vencimento || null
})
.eq("id",id)


if(error){
toast.error(error.message)
return
}

toast.success("Tarefa concluída")

buscarTarefas()

}



async function excluirTarefa(id:string){

const {error}=await supabase
.from("tarefas")
.delete()
.eq("id",id)


if(error){
toast.error(error.message)
return
}

toast.success("Tarefa excluída")

buscarTarefas()

}

},[])



async function buscarTarefas(){

const {data,error}= await supabase
.from("tarefas")
.select("*")
.order("criado_em",{ascending:false})


if(!error){

setTarefas(data || [])

}

}



async function salvarTarefa(){

console.log("FORM:", form)

if(!form.titulo){

toast.error("Digite o título da tarefa")
return

}

const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  toast.error("Usuário não autenticado")
  return
}


const {error}=await supabase
.from("tarefas")
.insert({
  titulo: form.titulo,
  descricao: form.descricao,
  status: form.status.toLowerCase(),
  prioridade: form.prioridade.toLowerCase()
})


if(error){

console.log("ERRO SUPABASE:", error)

toast.error(error.message)

return

}

toast.success("Tarefa criada")

setOpen(false)

setForm({

titulo:"",
descricao:"",
status:"pendente",
prioridade:"media",


})


buscarTarefas()


}



return(

<div className="space-y-6 p-6">


<div className="flex justify-between items-center">

<div>

<h1 className="text-3xl font-bold">
Tarefas
</h1>

<p className="text-muted-foreground">
Gerencie suas atividades
</p>

</div>


<Button onClick={()=>setOpen(true)}>
<Plus className="mr-2 h-4 w-4"/>
Nova tarefa
</Button>


</div>




<div className="grid gap-4 md:grid-cols-3">


<Card>

<CardHeader>

<CardTitle>
Pendentes
</CardTitle>

</CardHeader>

<CardContent>

<Clock/>

{
tarefas.filter(t=>t.status==="pendente").length
}

</CardContent>

</Card>



<Card>

<CardHeader>

<CardTitle>
Concluídas
</CardTitle>

</CardHeader>

<CardContent>

<CheckCircle/>

{
tarefas.filter(t=>t.status==="concluida").length
}

</CardContent>

</Card>



<Card>

<CardHeader>

<CardTitle>
Prioridade Alta
</CardTitle>

</CardHeader>

<CardContent>

<AlertTriangle/>

{
tarefas.filter(t=>t.prioridade==="alta").length
}

</CardContent>

</Card>


</div>




<div className="grid gap-4">
<div className="flex gap-3">

<Button
variant={filtro==="todos" ? "default":"outline"}
onClick={()=>setFiltro("todos")}
>
Todas
</Button>


<Button
variant={filtro==="pendente" ? "default":"outline"}
onClick={()=>setFiltro("pendente")}
>
Pendentes
</Button>


<Button
variant={filtro==="concluida" ? "default":"outline"}
onClick={()=>setFiltro("concluida")}
>
Concluídas
</Button>

</div>

{
tarefas
.filter(t => filtro==="todos" ? true : t.status===filtro)
.map((tarefa)=>(


<Card key={tarefa.id}>


<CardHeader>

<CardTitle className="flex justify-between">

{tarefa.titulo}

<span className="text-sm">

{tarefa.status}

</span>

</CardTitle>


</CardHeader>


<CardContent><div className="flex gap-2 mt-4">


{
tarefa.status !== "concluida" && (

<Button
size="sm"
onClick={()=>concluirTarefa(tarefa.id)}
>
<CheckCircle className="mr-2 h-4 w-4"/>
Concluir
</Button>

)
}



<Button
size="sm"
variant="destructive"
onClick={()=>excluirTarefa(tarefa.id)}
>

Excluir

</Button>


</div>

<p>
{tarefa.descricao}
</p>


<div className="mt-3 text-sm text-muted-foreground">

Prioridade: {tarefa.prioridade}

<br/>

Prazo: {tarefa.data_limite || "Sem prazo"}

</div>


</CardContent>


</Card>


))

}



</div>





<Dialog open={open} onOpenChange={setOpen}>


<DialogContent>


<DialogHeader>

<DialogTitle>
Nova tarefa
</DialogTitle>

</DialogHeader>



<div className="space-y-4">
<div>

<Label>
Título
</Label>

<Input

value={form.titulo}

onChange={(e)=>
setForm({
...form,
titulo:e.target.value
})
}

/>

</div>




<div>

<Label>
Descrição
</Label>

<Textarea

value={form.descricao}

onChange={(e)=>
setForm({...form,descricao:e.target.value})
}

/>

</div>



<div>

<Label>Status</Label>

<Select
value={form.status}
onValueChange={(v)=>
setForm({...form,status:v})
}
>

<SelectTrigger>

<SelectValue />

</SelectTrigger>


<SelectContent>

<SelectItem value="pendente">
Pendente
</SelectItem>


<SelectItem value="em_andamento">
Em andamento
</SelectItem>


<SelectItem value="concluida">
Concluída
</SelectItem>


<SelectItem value="cancelada">
Cancelada
</SelectItem>


</SelectContent>

</Select>

</div>


<div>

<Label>
Prioridade
</Label>


<Select

value={form.prioridade}

onValueChange={(v)=>
setForm({...form,prioridade:v})
}

>


<SelectTrigger>

<SelectValue />

</SelectTrigger>


<SelectContent>


<SelectItem value="baixa">
Baixa
</SelectItem>


<SelectItem value="media">
Média
</SelectItem>


<SelectItem value="alta">
Alta
</SelectItem>


<SelectItem value="urgente">
Urgente
</SelectItem>


</SelectContent>


</Select>

</div>




</div>



<DialogFooter>

<Button onClick={salvarTarefa}>
Criar tarefa
</Button>

</DialogFooter>



</DialogContent>


</Dialog>




</div>


)

}
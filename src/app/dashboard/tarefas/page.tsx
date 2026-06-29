"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

import {
Card,
CardContent,
CardHeader,
CardTitle
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogFooter
} from "@/components/ui/dialog"

import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue
} from "@/components/ui/select"

import {
Plus,
CheckCircle,
Clock,
AlertTriangle,
Pencil,
Play
} from "lucide-react"

import { toast } from "sonner"


export default function TarefasPage(){

const supabase=createClient()


const [tarefas,setTarefas]=useState<any[]>([])

const [open,setOpen]=useState(false)

const [editando,setEditando]=useState<any>(null)

const [busca,setBusca]=useState("")

const [statusFiltro,setStatusFiltro]=useState("todos")

const [form,setForm]=useState({

titulo:"",
descricao:"",
status:"pendente",
prioridade:"media",
data_limite:""

})



useEffect(()=>{

buscarTarefas()

},[])



async function buscarTarefas(){


const {data,error}=await supabase

.from("tarefas")

.select("*")

.order("created_at",{ascending:false})


if(!error){

setTarefas(data || [])

}

}





async function salvar(){


if(!form.titulo){

toast.error("Digite o título")

return

}



if(editando){


const {error}=await supabase

.from("tarefas")

.update(form)

.eq("id",editando.id)


if(error){

toast.error(error.message)

return

}


toast.success("Tarefa atualizada")


}else{


const {error}=await supabase

.from("tarefas")

.insert(form)


if(error){

toast.error(error.message)

return

}


toast.success("Tarefa criada")


}


setOpen(false)

setEditando(null)


setForm({

titulo:"",
descricao:"",
status:"pendente",
prioridade:"media",
data_limite:""

})


buscarTarefas()

}





function editar(t:any){

setEditando(t)

setForm({

titulo:t.titulo,

descricao:t.descricao || "",

status:t.status,

prioridade:t.prioridade,

data_limite:t.data_limite || ""

})


setOpen(true)

}





async function mudarStatus(
id:string,
status:string
){

await supabase

.from("tarefas")

.update({status})

.eq("id",id)


buscarTarefas()

toast.success("Status atualizado")

}





async function excluir(id:string){

await supabase

.from("tarefas")

.delete()

.eq("id",id)


buscarTarefas()

toast.success("Excluída")

}




const lista=tarefas

.filter(t=>

statusFiltro==="todos"

?

true

:

t.status===statusFiltro

)

.filter(t=>

t.titulo

.toLowerCase()

.includes(busca.toLowerCase())

)



return(

<div className="space-y-6 p-6">


<div className="flex justify-between">


<div>

<h1 className="text-3xl font-bold">

Tarefas

</h1>

<p className="text-muted-foreground">

Organize sua operação

</p>

</div>


<Button onClick={()=>setOpen(true)}>

<Plus className="mr-2 h-4 w-4"/>

Nova tarefa

</Button>


</div>





<div className="grid md:grid-cols-3 gap-4">


<Card>

<CardHeader>

<CardTitle>Pendentes</CardTitle>

</CardHeader>

<CardContent>

<Clock/>

<h2 className="text-3xl font-bold">

{tarefas.filter(t=>t.status==="pendente").length}

</h2>

</CardContent>

</Card>



<Card>

<CardHeader>

<CardTitle>Em andamento</CardTitle>

</CardHeader>

<CardContent>

<Play/>

<h2 className="text-3xl font-bold">

{tarefas.filter(t=>t.status==="em_andamento").length}

</h2>

</CardContent>

</Card>




<Card>

<CardHeader>

<CardTitle>Alta prioridade</CardTitle>

</CardHeader>

<CardContent>

<AlertTriangle/>

<h2 className="text-3xl font-bold">

{tarefas.filter(t=>t.prioridade==="alta").length}

</h2>

</CardContent>

</Card>


</div>





<div className="flex gap-3 flex-wrap">


<Input

placeholder="Buscar..."

value={busca}

onChange={e=>setBusca(e.target.value)}

/>



<Select

value={statusFiltro}

onValueChange={setStatusFiltro}

>

<SelectTrigger className="w-[200px]">

<SelectValue/>

</SelectTrigger>


<SelectContent>

<SelectItem value="todos">

Todas

</SelectItem>

<SelectItem value="pendente">

Pendentes

</SelectItem>

<SelectItem value="em_andamento">

Em andamento

</SelectItem>


<SelectItem value="concluida">

Concluídas

</SelectItem>


</SelectContent>


</Select>


</div>





<div className="space-y-4">


{lista.map(t=>(


<Card key={t.id}>


<CardHeader>

<CardTitle className="flex justify-between">


{t.titulo}



<span className="text-xs">

{t.status}

</span>


</CardTitle>

</CardHeader>



<CardContent>


<p>

{t.descricao}

</p>


<p className="text-sm text-muted-foreground mt-3">

Prioridade: {t.prioridade}

<br/>

Prazo: {t.data_limite || "Sem prazo"}

</p>




<div className="flex gap-2 mt-4">


{t.status==="pendente" &&

<Button

onClick={()=>mudarStatus(t.id,"em_andamento")}

>

<Play className="mr-2 h-4 w-4"/>

Iniciar

</Button>

}



{t.status!=="concluida" &&

<Button

onClick={()=>mudarStatus(t.id,"concluida")}

>

<CheckCircle className="mr-2 h-4 w-4"/>

Concluir

</Button>

}



<Button

variant="outline"

onClick={()=>editar(t)}

>

<Pencil/>

</Button>



<Button

variant="destructive"

onClick={()=>excluir(t.id)}

>

Excluir

</Button>



</div>


</CardContent>


</Card>


))}


</div>






<Dialog open={open} onOpenChange={setOpen}>


<DialogContent>


<DialogHeader>

<DialogTitle>

{editando?"Editar":"Nova"} tarefa

</DialogTitle>

</DialogHeader>




<Label>Título</Label>

<Input

value={form.titulo}

onChange={e=>setForm({...form,titulo:e.target.value})}

/>



<Label>Descrição</Label>

<Textarea

value={form.descricao}

onChange={e=>setForm({...form,descricao:e.target.value})}

/>




<Label>Prioridade</Label>


<Select

value={form.prioridade}

onValueChange={v=>setForm({...form,prioridade:v})}

>


<SelectTrigger>

<SelectValue/>

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


</SelectContent>


</Select>




<Label>Prazo</Label>

<Input

type="date"

value={form.data_limite}

onChange={e=>setForm({...form,data_limite:e.target.value})}

/>




<DialogFooter>

<Button onClick={salvar}>

Salvar

</Button>

</DialogFooter>


</DialogContent>


</Dialog>


</div>

)


}
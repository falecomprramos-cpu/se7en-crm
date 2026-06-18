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

import {
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Pencil
} from "lucide-react"

import { toast } from "sonner"



export default function TarefasPage(){


const supabase = createClient()


const [tarefas,setTarefas] = useState<any[]>([])

const [open,setOpen] = useState(false)

const [editando,setEditando] = useState<any>(null)

const [filtro,setFiltro] = useState("todos")

const [busca,setBusca] = useState("")
const [prioridadeFiltro,setPrioridadeFiltro] = useState("todas")



const [form,setForm] = useState({

titulo:"",
descricao:"",
status:"pendente",
prioridade:"media",
data_vencimento:""

})





useEffect(()=>{

buscarTarefas()

},[])





async function buscarTarefas(){


const {data,error}=await supabase
.from("tarefas")
.select("*")
.order("criado_em",{ascending:false})



if(!error){

setTarefas(data || [])

}


}







async function salvarTarefa(){



if(!form.titulo){

toast.error("Digite o título da tarefa")

return

}




// EDITAR

if(editando){


const {error}=await supabase
.from("tarefas")
.update({

titulo:form.titulo,

descricao:form.descricao,

status:form.status,

prioridade:form.prioridade,

data_vencimento:form.data_vencimento || null


})
.eq("id",editando.id)




if(error){

toast.error(error.message)

return

}



toast.success("Tarefa atualizada")


setEditando(null)

setOpen(false)

buscarTarefas()


return


}




// CRIAR


const {error}=await supabase
.from("tarefas")
.insert({

titulo:form.titulo,

descricao:form.descricao,

status:form.status,

prioridade:form.prioridade,

data_vencimento:form.data_vencimento || null


})



if(error){

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
data_vencimento:""

})


buscarTarefas()


}

async function concluirTarefa(id:string){


const {error}=await supabase
.from("tarefas")
.update({

status:"concluida"

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






function abrirEditar(tarefa:any){


setEditando(tarefa)


setForm({

titulo:tarefa.titulo,

descricao:tarefa.descricao || "",

status:tarefa.status,

prioridade:tarefa.prioridade,

data_vencimento:tarefa.data_vencimento || ""

})


setOpen(true)


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



<Button onClick={()=>{

setEditando(null)

setForm({

titulo:"",
descricao:"",
status:"pendente",
prioridade:"media",
data_vencimento:""

})

setOpen(true)

}}>


<Plus className="mr-2 h-4 w-4"/>

Nova tarefa


</Button>


</div>







<div className="grid md:grid-cols-3 gap-4">



<Card>

<CardHeader>

<CardTitle>

Pendentes

</CardTitle>

</CardHeader>


<CardContent>

<Clock/>


<p className="text-2xl font-bold">

{
tarefas.filter(t=>t.status==="pendente").length
}

</p>


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


<p className="text-2xl font-bold">

{
tarefas.filter(t=>t.status==="concluida").length
}

</p>


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


<p className="text-2xl font-bold">

{
tarefas.filter(t=>t.prioridade==="alta").length
}

</p>


</CardContent>


</Card>



</div>






<div className="flex gap-3 flex-wrap">


<Input

placeholder="Buscar tarefa..."

value={busca}

onChange={(e)=>
setBusca(e.target.value)
}

/>



<Select

value={prioridadeFiltro}

onValueChange={setPrioridadeFiltro}

>


<SelectTrigger className="w-[180px]">

<SelectValue placeholder="Prioridade"/>

</SelectTrigger>



<SelectContent>


<SelectItem value="todas">

Todas prioridades

</SelectItem>


<SelectItem value="alta">

Alta

</SelectItem>


<SelectItem value="media">

Média

</SelectItem>


<SelectItem value="baixa">

Baixa

</SelectItem>


</SelectContent>


</Select>

</div>


<div className="flex gap-3">

<Button onClick={()=>setFiltro("todos")}>

Todas

</Button>


<Button onClick={()=>setFiltro("pendente")}>

Pendentes

</Button>


<Button onClick={()=>setFiltro("concluida")}>

Concluídas

</Button>


</div>

<div className="space-y-4">


{

tarefas

.filter(t=> 
filtro==="todos" 
? true 
: t.status===filtro
)

.filter(t=>
prioridadeFiltro==="todas"
?
true
:
t.prioridade===prioridadeFiltro
)

.filter(t=>
t.titulo
.toLowerCase()
.includes(busca.toLowerCase())
)

.map(tarefa=>(



<Card key={tarefa.id}>


<CardHeader>


<CardTitle className="flex justify-between">


{tarefa.titulo}



<span
className={`
px-3 py-1 rounded-full text-xs font-medium

${
tarefa.status === "concluida"

? "bg-green-500/20 text-green-400"

:

tarefa.status === "em_andamento"

? "bg-blue-500/20 text-blue-400"

:

"bg-yellow-500/20 text-yellow-400"

}

`}
>

{tarefa.status === "concluida"

? "Concluída"

:

tarefa.status === "em_andamento"

? "Em andamento"

:

"Pendente"

}

</span>


</CardTitle>


</CardHeader>





<CardContent>



<p>

{tarefa.descricao}

</p>




<p className="text-sm mt-3 text-muted-foreground">


Prioridade: {tarefa.prioridade}


<br/>


Prazo: {tarefa.data_vencimento || "Sem prazo"}



</p>





<div className="flex gap-2 mt-4">





{

tarefa.status !== "concluida" &&


<Button

onClick={()=>concluirTarefa(tarefa.id)}

>


<CheckCircle className="mr-2 h-4 w-4"/>


Concluir


</Button>


}




<Button

variant="outline"

onClick={()=>abrirEditar(tarefa)}

>


<Pencil className="mr-2 h-4 w-4"/>


Editar


</Button>





<Button

variant="destructive"

onClick={()=>excluirTarefa(tarefa.id)}

>


Excluir


</Button>



</div>




</CardContent>



</Card>


))


}



</div>








<Dialog 
open={open} 
onOpenChange={(valor)=>{

setOpen(valor)

if(!valor){

setEditando(null)

setForm({
titulo:"",
descricao:"",
status:"pendente",
prioridade:"media",
data_vencimento:""
})

}

}}
>


<DialogContent>



<DialogHeader>


<DialogTitle>

{editando ? "Editar tarefa" : "Nova tarefa"}

</DialogTitle>


</DialogHeader>





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






<Label>

Descrição

</Label>



<Textarea


value={form.descricao}


onChange={(e)=>

setForm({

...form,

descricao:e.target.value

})


}


/>







<Label>

Status

</Label>


<Select


value={form.status}


onValueChange={(v)=>

setForm({

...form,

status:v

})


}


>


<SelectTrigger>

<SelectValue/>

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



</SelectContent>



</Select>






<Label>

Prioridade

</Label>



<Select


value={form.prioridade}


onValueChange={(v)=>

setForm({

...form,

prioridade:v

})


}


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



<SelectItem value="urgente">

Urgente

</SelectItem>


</SelectContent>



</Select>







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






<DialogFooter>


<Button onClick={salvarTarefa}>


{editando ? "Salvar alteração" : "Criar tarefa"}



</Button>


</DialogFooter>



</DialogContent>



</Dialog>






</div>


)


}
"use client"

import { useEffect, useState } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"

import { createClient } from "@/lib/supabase/client"

import {
Card,
CardContent,
CardHeader,
CardTitle
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
Plus,
Trash2,
Edit
} from "lucide-react"


const locales = {
"pt-BR": ptBR
}


const localizer = dateFnsLocalizer({
format,
parse,
startOfWeek,
getDay,
locales,
})


export default function CalendarioPage(){

const supabase = createClient()


const [eventos,setEventos]=useState<any[]>([])
const [clientes,setClientes]=useState<any[]>([])

const [mostrarForm,setMostrarForm]=useState(false)

const [editando,setEditando]=useState<any>(null)


const [form,setForm]=useState({

titulo:"",
tipo:"",
cliente_id:"",
descricao:"",
data_evento:"",
horario:""

})



useEffect(()=>{

carregar()

},[])



async function carregar(){

const {data:eventosData}=await supabase
.from("agenda")
.select(`
*,
clientes(nome)
`)
.order("data_evento")


const lista=(eventosData || []).map((e)=>({

id:e.id,

title:e.titulo,

start:new Date(
e.data_evento+"T"+e.horario
),

end:new Date(
e.data_evento+"T"+e.horario
),

dados:e

}))


setEventos(lista)



const {data:clientesData}=await supabase
.from("clientes")
.select("id,nome")
.order("nome")


setClientes(clientesData || [])


}




async function salvar(){


if(!form.titulo || !form.data_evento){

alert("Preencha título e data")

return

}



if(editando){


await supabase
.from("agenda")
.update(form)
.eq("id",editando.id)


}else{


await supabase
.from("agenda")
.insert(form)


}



setForm({

titulo:"",
tipo:"",
cliente_id:"",
descricao:"",
data_evento:"",
horario:""

})


setEditando(null)

setMostrarForm(false)

carregar()


}





async function excluir(id:string){

await supabase
.from("agenda")
.delete()
.eq("id",id)


carregar()

}





function abrirEditar(event:any){


const e=event.dados


setEditando(e)


setForm({

titulo:e.titulo,

tipo:e.tipo || "",

cliente_id:e.cliente_id || "",

descricao:e.descricao || "",

data_evento:e.data_evento,

horario:e.horario

})


setMostrarForm(true)

}




function Evento({event}:any){

return(

<div className="text-xs">

<b>{event.title}</b>


<div>

{event.dados.clientes?.nome}

</div>


<div className="flex gap-1 mt-2">


<Button
size="sm"
onClick={()=>abrirEditar(event)}
>

<Edit className="h-3 w-3"/>

</Button>


<Button
size="sm"
variant="destructive"
onClick={()=>excluir(event.id)}
>

<Trash2 className="h-3 w-3"/>

</Button>


</div>


</div>

)

}




return(

<div className="space-y-6 p-6">


<div className="flex justify-between">


<div>

<h1 className="text-3xl font-bold">

Calendário

</h1>

<p className="text-muted-foreground">

Organize posts, reuniões e entregas

</p>

</div>


<Button
onClick={()=>setMostrarForm(!mostrarForm)}
>

<Plus className="mr-2 h-4 w-4"/>

Novo evento

</Button>


</div>



{mostrarForm && (

<Card>

<CardHeader>

<CardTitle>

{editando ? "Editar evento":"Novo evento"}

</CardTitle>

</CardHeader>


<CardContent className="space-y-3">


<Input
placeholder="Título"
value={form.titulo}
onChange={e=>setForm({...form,titulo:e.target.value})}
/>



<select

className="border rounded p-2 w-full"

value={form.tipo}

onChange={e=>setForm({...form,tipo:e.target.value})}

>


<option value="">Tipo</option>

<option value="post">Post</option>

<option value="reuniao">Reunião</option>

<option value="gravacao">Gravação</option>

<option value="entrega">Entrega</option>


</select>



<select

className="border rounded p-2 w-full"

value={form.cliente_id}

onChange={e=>setForm({...form,cliente_id:e.target.value})}

>

<option value="">Cliente</option>


{clientes.map(c=>(

<option key={c.id} value={c.id}>

{c.nome}

</option>

))}


</select>



<Input
type="date"
value={form.data_evento}
onChange={e=>setForm({...form,data_evento:e.target.value})}
/>


<Input
type="time"
value={form.horario}
onChange={e=>setForm({...form,horario:e.target.value})}
/>



<Button onClick={salvar}>

Salvar

</Button>


</CardContent>

</Card>

)}




<div className="bg-white rounded-xl p-4 text-black">


<Calendar

localizer={localizer}

events={eventos}

startAccessor="start"

endAccessor="end"

style={{
height:700
}}

views={[
"month",
"week",
"day",
"agenda"
]}


components={{

event:Evento

}}

/>


</div>


</div>


)

}
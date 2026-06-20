"use client"

import {useEffect,useState} from "react"
import {createClient} from "@/lib/supabase/client"

import {
Card,
CardContent,
CardHeader,
CardTitle
} from "@/components/ui/card"

import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"

import {
Plus,
Trash2,
Calendar
} from "lucide-react"

import {toast} from "sonner"


export default function AgendaPage(){


const supabase=createClient()


const [eventos,setEventos]=useState<any[]>([])
const [leads,setLeads]=useState<any[]>([])


const [titulo,setTitulo]=useState("")
const [descricao,setDescricao]=useState("")
const [data,setData]=useState("")
const [horario,setHorario]=useState("")
const [tipo,setTipo]=useState("")
const [leadId,setLeadId]=useState("")



useEffect(()=>{

buscarAgenda()
buscarLeads()

},[])



async function buscarLeads(){


const {data,error}=await supabase
.from("leads")
.select("id,nome")


if(!error){

setLeads(data || [])

}

}




async function buscarAgenda(){


const {data,error}=await supabase

.from("agenda")

.select(`
*,
leads(
nome
)
`)

.order("data_evento",
{
ascending:true
})


if(!error){

setEventos(data || [])

}


}




async function salvarEvento(){


if(!titulo){

toast.error("Digite o título")

return

}



const {error}=await supabase

.from("agenda")

.insert({

titulo,
descricao,
data_evento:data,
horario,
tipo,
lead_id:leadId || null

})



if(error){

toast.error(error.message)

return

}



toast.success("Evento criado")


setTitulo("")
setDescricao("")
setData("")
setHorario("")
setTipo("")
setLeadId("")


buscarAgenda()


}





async function excluirEvento(id:string){


await supabase

.from("agenda")

.delete()

.eq("id",id)



buscarAgenda()


}




return (

<div className="space-y-6 p-6">


<div>

<h1 className="text-3xl font-bold">

Calendário

</h1>


<p className="text-muted-foreground">

Reuniões, gravações, entregas e follow-ups

</p>

</div>




<Card>

<CardHeader>

<CardTitle>
Novo compromisso
</CardTitle>

</CardHeader>



<CardContent className="space-y-4">


<Input

placeholder="Título"

value={titulo}

onChange={(e)=>setTitulo(e.target.value)}

/>



<Textarea

placeholder="Descrição"

value={descricao}

onChange={(e)=>setDescricao(e.target.value)}

/>



<Label>

Tipo

</Label>


<select

className="w-full border rounded p-2"

value={tipo}

onChange={(e)=>setTipo(e.target.value)}

>


<option value="">
Selecione
</option>

<option>
Reunião
</option>

<option>
Gravação
</option>

<option>
Entrega
</option>

<option>
Follow-up
</option>


</select>




<Label>

Cliente

</Label>


<select

className="w-full border rounded p-2"

value={leadId}

onChange={(e)=>setLeadId(e.target.value)}

>


<option value="">

Sem cliente

</option>


{

leads.map((lead)=>(

<option

key={lead.id}

value={lead.id}

>

{lead.nome}

</option>


))

}


</select>




<Input

type="date"

value={data}

onChange={(e)=>setData(e.target.value)}

/>



<Input

type="time"

value={horario}

onChange={(e)=>setHorario(e.target.value)}

/>



<Button onClick={salvarEvento}>


<Plus className="mr-2"/>

Salvar


</Button>



</CardContent>

</Card>





<div className="grid gap-4">


{

eventos.map((evento)=>(


<Card key={evento.id}>


<CardHeader>


<CardTitle className="flex justify-between">


{evento.titulo}


<Calendar/>

</CardTitle>


</CardHeader>


<CardContent>


<p>
📌 {evento.tipo}
</p>


<p>

👤 {evento.leads?.nome || "Sem cliente"}

</p>


<p className="mt-3">

{evento.descricao}

</p>


<p className="text-sm mt-3">

{evento.data_evento}

<br/>

{evento.horario}

</p>



<Button

variant="destructive"

className="mt-4"

onClick={()=>excluirEvento(evento.id)}

>


<Trash2 className="mr-2"/>

Excluir


</Button>



</CardContent>


</Card>


))


}


</div>


</div>

)


}
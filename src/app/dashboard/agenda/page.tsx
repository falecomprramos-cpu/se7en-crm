"use client"

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


export default function AgendaPage(){

const supabase = createClient()


const [eventos,setEventos] = useState<any[]>([])


const [titulo,setTitulo] = useState("")
const [tipo,setTipo] = useState("")
const [data,setData] = useState("")
const [horario,setHorario] = useState("")



useEffect(()=>{

buscarEventos()

},[])



async function buscarEventos(){


const {data,error}= await supabase
.from("agenda")
.select("*")
.order("data_evento")


if(!error){

setEventos(data || [])

}

}



async function criarEvento(){


if(!titulo || !data){

alert("Preencha título e data")

return

}



const {error}= await supabase
.from("agenda")
.insert({

titulo,

tipo,

data_evento:data,

horario

})



if(error){

alert(error.message)

return

}



alert("Evento criado")


setTitulo("")
setTipo("")
setData("")
setHorario("")


buscarEventos()


}





async function excluir(id:string){


await supabase
.from("agenda")
.delete()
.eq("id",id)


buscarEventos()


}



return (

<div className="p-6 space-y-6">


<h1 className="text-3xl font-bold">

Calendário

</h1>



<Card>


<CardHeader>

<CardTitle>

Novo evento

</CardTitle>

</CardHeader>



<CardContent className="space-y-3">


<Input

placeholder="Título"

value={titulo}

onChange={(e)=>setTitulo(e.target.value)}

/>



<select

className="border rounded p-2 w-full"

value={tipo}

onChange={(e)=>setTipo(e.target.value)}

>


<option value="">

Tipo

</option>


<option value="post">

Post

</option>


<option value="gravacao">

Gravação

</option>


<option value="reuniao">

Reunião

</option>


<option value="follow">

Follow-up

</option>


<option value="entrega">

Entrega

</option>


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



<Button onClick={criarEvento}>

Adicionar evento

</Button>


</CardContent>


</Card>





<div className="grid gap-4">


{
eventos.map((evento)=>(


<Card key={evento.id}>


<CardHeader>


<CardTitle>

{evento.titulo}

</CardTitle>


</CardHeader>


<CardContent>


<p>
📌 Tipo: {evento.tipo}
</p>


<p>
📅 {evento.data_evento}
</p>


<p>
⏰ {evento.horario}
</p>



<Button

variant="destructive"

className="mt-3"

onClick={()=>excluir(evento.id)}

>

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
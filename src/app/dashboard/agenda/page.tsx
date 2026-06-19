"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { Plus, Calendar, Trash2 } from "lucide-react"

import { toast } from "sonner"


export default function AgendaPage(){


const supabase = createClient()


const [eventos,setEventos] = useState<any[]>([])


const [titulo,setTitulo] = useState("")
const [descricao,setDescricao] = useState("")
const [data,setData] = useState("")
const [horario,setHorario] = useState("")



useEffect(()=>{

buscarAgenda()

},[])



async function buscarAgenda(){


const {data,error}=await supabase
.from("agenda")
.select("*")
.order("data_evento",{ascending:true})


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
horario

})



if(error){

toast.error(error.message)

return

}



toast.success("Compromisso criado")



setTitulo("")
setDescricao("")
setData("")
setHorario("")


buscarAgenda()



}




async function excluirEvento(id:string){


const {error}=await supabase
.from("agenda")
.delete()
.eq("id",id)



if(error){

toast.error(error.message)

return

}


toast.success("Evento excluído")


buscarAgenda()



}





return(


<div className="space-y-6 p-6">



<div>


<h1 className="text-3xl font-bold">

Agenda

</h1>


<p className="text-muted-foreground">

Organize seus compromissos

</p>


</div>





<Card>


<CardHeader>

<CardTitle>

Novo compromisso

</CardTitle>

</CardHeader>



<CardContent className="space-y-4">


<Label>
Título
</Label>


<Input

value={titulo}

onChange={(e)=>setTitulo(e.target.value)}

placeholder="Ex: Reunião com cliente"

/>




<Label>
Descrição
</Label>


<Textarea

value={descricao}

onChange={(e)=>setDescricao(e.target.value)}

/>





<Label>
Data
</Label>


<Input

type="date"

value={data}

onChange={(e)=>setData(e.target.value)}

/>





<Label>
Horário
</Label>


<Input

type="time"

value={horario}

onChange={(e)=>setHorario(e.target.value)}

/>





<Button onClick={salvarEvento}>


<Plus className="mr-2 h-4 w-4"/>

Salvar compromisso


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


<Calendar className="h-5 w-5"/>


</CardTitle>


</CardHeader>



<CardContent>


<p>

{evento.descricao}

</p>



<p className="text-sm mt-3 text-muted-foreground">

{evento.data_evento}

<br/>

{evento.horario}

</p>



<Button

variant="destructive"

className="mt-4"

onClick={()=>excluirEvento(evento.id)}

>


<Trash2 className="mr-2 h-4 w-4"/>

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
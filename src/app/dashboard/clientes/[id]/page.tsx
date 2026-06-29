"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

import {
Card,
CardContent,
CardHeader,
CardTitle
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"

import {
MessageCircle,
DollarSign,
Briefcase,
CheckSquare,
Calendar
} from "lucide-react"


export default function ClienteDetalhe(){

const supabase = createClient()

const params = useParams()

const id = params.id as string


const [cliente,setCliente] = useState<any>(null)

const [vendas,setVendas] = useState<any[]>([])

const [projetos,setProjetos] = useState<any[]>([])

const [tarefas,setTarefas] = useState<any[]>([])

const [agenda,setAgenda] = useState<any[]>([])



useEffect(()=>{

if(id){

carregar()

}

},[id])



async function carregar(){


const {data:c,error} = await supabase
.from("clientes")
.select("*")
.eq("id",id)
.single()



if(error){

console.log(error)

return

}


setCliente(c)



const {data:v}=await supabase
.from("vendas")
.select("*")
.eq("cliente_id",id)


setVendas(v || [])



const {data:p}=await supabase
.from("projetos")
.select("*")
.eq("cliente_id",id)


setProjetos(p || [])



const {data:t}=await supabase
.from("tarefas")
.select("*")
.eq("cliente_id",id)


setTarefas(t || [])



const {data:a}=await supabase
.from("agenda")
.select("*")
.eq("cliente_id",id)


setAgenda(a || [])



}




if(!cliente){

return (

<div className="p-6">

Carregando cliente...

</div>

)

}




const total = vendas.reduce(

(a,v)=>a+(v.valor || 0),

0

)



return (

<div className="space-y-6 p-6">


<div className="flex justify-between">


<div>

<h1 className="text-3xl font-bold">

{cliente.nome}

</h1>


<p>

{cliente.empresa}

</p>


</div>



<Badge>

{cliente.status}

</Badge>


</div>




<Card>

<CardHeader>

<CardTitle>

Informações

</CardTitle>

</CardHeader>


<CardContent className="space-y-2">


<p>Email: {cliente.email}</p>

<p>WhatsApp: {cliente.whatsapp}</p>

<p>Segmento: {cliente.segmento}</p>



{cliente.whatsapp && (


<Button

className="bg-green-600"

onClick={()=>{

window.open(

`https://wa.me/55${cliente.whatsapp}`,

"_blank"

)

}}

>


<MessageCircle className="mr-2"/>

WhatsApp


</Button>


)}


</CardContent>

</Card>





<div className="grid md:grid-cols-4 gap-4">


<Card>

<CardContent className="p-5">

<DollarSign/>

<p>Vendas</p>

<h2 className="text-2xl">

R$ {total}

</h2>


</CardContent>

</Card>



<Card>

<CardContent className="p-5">

<Briefcase/>

<p>Projetos</p>

<h2>

{projetos.length}

</h2>


</CardContent>

</Card>



<Card>

<CardContent className="p-5">

<CheckSquare/>

<p>Tarefas</p>

<h2>

{tarefas.length}

</h2>


</CardContent>

</Card>



<Card>

<CardContent className="p-5">

<Calendar/>

<p>Eventos</p>

<h2>

{agenda.length}

</h2>


</CardContent>

</Card>


</div>





<Card>

<CardHeader>

<CardTitle>

Serviços contratados

</CardTitle>

</CardHeader>


<CardContent>


{

vendas.map(v=>(


<div

key={v.id}

className="border p-3 rounded mb-2"

>


Valor:

R$ {v.valor}


<br/>


{v.descricao}


</div>


))


}


</CardContent>

</Card>





</div>


)


}
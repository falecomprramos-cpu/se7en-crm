"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

import {
Card,
CardContent
} from "@/components/ui/card"

import {
Button
} from "@/components/ui/button"

import {
Badge
} from "@/components/ui/badge"

import {
Input
} from "@/components/ui/input"

import {
Search,
Phone,
Eye
} from "lucide-react"


export default function ClientesPage(){

const supabase=createClient()


const [clientes,setClientes]=useState<any[]>([])
const [busca,setBusca]=useState("")
const [loading,setLoading]=useState(true)



useEffect(()=>{

buscarClientes()

},[])



async function buscarClientes(){


setLoading(true)


const {data,error}=await supabase

.from("clientes")

.select("*")

.order("created_at",{ascending:false})



console.log("CLIENTES:",data)
console.log("ERRO:",error)



if(data){

setClientes(data)

}



setLoading(false)


}





const filtrados=clientes.filter(c=>{


const texto=

`${c.nome || ""}
${c.empresa || ""}
${c.email || ""}`.toLowerCase()



return texto.includes(
busca.toLowerCase()
)


})






return(


<div className="space-y-6">


<div className="flex justify-between items-center">


<div>

<h1 className="text-3xl font-bold">

Clientes

</h1>


<p className="text-muted-foreground">

Lista de clientes cadastrados

</p>


</div>


</div>





<div className="relative">


<Search
className="absolute left-3 top-3 h-4 w-4"
/>


<Input

className="pl-10"

placeholder="Buscar cliente..."

value={busca}

onChange={(e)=>
setBusca(e.target.value)
}

/>


</div>







{

loading ?

<p>
Carregando clientes...
</p>



:

filtrados.length===0 ?

<p>

Nenhum cliente encontrado

</p>



:


<div className="grid md:grid-cols-3 gap-4">


{

filtrados.map(cliente=>(


<Card key={cliente.id}>


<CardContent className="p-5 space-y-4">



<div className="flex justify-between">


<div>


<h2 className="font-bold text-lg">

{cliente.nome}

</h2>


<p className="text-sm text-muted-foreground">

{cliente.empresa}

</p>


</div>


<Badge>

{cliente.status}

</Badge>


</div>





<div className="text-sm space-y-2">


<p>
📧 {cliente.email || "Sem email"}
</p>



<p>
📱 {cliente.whatsapp || "Sem whatsapp"}
</p>



<p>
Segmento:
{cliente.segmento || "Não informado"}
</p>


<p>
🔐 Senha:
<span className="font-bold">
{" "}
{cliente.senha_acesso || "Sem senha cadastrada"}
</span>
</p>


</div>






<div className="flex gap-2">


<Button

variant="outline"

onClick={()=>{

window.location.href=

`/dashboard/clientes/${cliente.id}`


}}

>


<Eye className="h-4 w-4 mr-2"/>

Ver cliente


</Button>






{

cliente.whatsapp &&


<Button

className="bg-green-600 text-white"

onClick={()=>{


window.open(

`https://wa.me/55${cliente.whatsapp}`,

"_blank"

)


}}

>


<Phone className="h-4 w-4"/>


</Button>


}



</div>





</CardContent>


</Card>


))


}


</div>


}



</div>


)


}
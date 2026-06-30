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

import {
Mail,
Send
} from "lucide-react"


export default function EmailsPage(){

const supabase=createClient()

const [emails,setEmails]=useState<any[]>([])
const [busca,setBusca]=useState("")
const [loading,setLoading]=useState(true)


useEffect(()=>{

carregarEmails()

},[])



async function carregarEmails(){

setLoading(true)


const {data,error}=await supabase

.from("clientes")

.select("id,nome,email")

.not("email","is",null)



if(error){

console.log(error)

}


setEmails(data || [])

setLoading(false)

}




const filtrados=emails.filter(e=>{

return (

e.nome?.toLowerCase()
.includes(busca.toLowerCase())

||

e.email?.toLowerCase()
.includes(busca.toLowerCase())

)

})



return(

<div className="space-y-6">


<div>

<h1 className="text-3xl font-bold">

Emails

</h1>


<p className="text-muted-foreground">

Lista de contatos dos clientes

</p>


</div>




<Input

placeholder="Buscar email..."

value={busca}

onChange={(e)=>
setBusca(e.target.value)
}

/>




{
loading ?

<p>
Carregando emails...
</p>


:

<div className="grid md:grid-cols-3 gap-4">


{
filtrados.map(cliente=>(


<Card key={cliente.id}>


<CardHeader>

<CardTitle className="flex gap-2 items-center">

<Mail className="h-5 w-5"/>

{cliente.nome}

</CardTitle>


</CardHeader>


<CardContent>


<p className="text-sm">

{cliente.email}

</p>


<Button
className="mt-4"
>

<Send className="mr-2 h-4 w-4"/>

Enviar

</Button>


</CardContent>


</Card>


))

}


</div>


}



</div>


)

}
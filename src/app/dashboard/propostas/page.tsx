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

import { Textarea } from "@/components/ui/textarea"

import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogFooter
} from "@/components/ui/dialog"

import {
Plus,
Trash2,
Pencil,
CheckCircle
} from "lucide-react"

import { toast } from "sonner"



export default function PropostasPage(){


const supabase = createClient()



const [propostas,setPropostas]=useState<any[]>([])

const [clientes,setClientes]=useState<any[]>([])

const [open,setOpen]=useState(false)

const [editando,setEditando]=useState<any>(null)



const [form,setForm]=useState({

cliente_id:"",
titulo:"",
descricao:"",
valor:0,
status:"Pendente",
validade:""

})





useEffect(()=>{

carregar()

},[])





async function carregar(){


const {data:prop,error}=await supabase

.from("propostas")

.select(`
*,
clientes(nome,empresa)
`)

.order("created_at",{ascending:false})



if(error){

console.log(error)

toast.error(error.message)

return

}



setPropostas(prop || [])





const {data:cli,error:erroClientes}=await supabase

.from("clientes")

.select("id,nome,empresa")

.order("nome")



if(erroClientes){

console.log(erroClientes)

return

}



setClientes(cli || [])



}







async function salvar(){



if(!form.cliente_id || !form.titulo){

toast.error("Cliente e título são obrigatórios")

return

}



const {data:userData}=await supabase.auth.getUser()



const dados={

...form,

user_id:userData.user?.id

}





if(editando){



const {error}=await supabase

.from("propostas")

.update(dados)

.eq("id",editando.id)



if(error){

toast.error(error.message)

return

}



toast.success("Proposta atualizada")



}else{



const {error}=await supabase

.from("propostas")

.insert(dados)



if(error){

toast.error(error.message)

return

}



toast.success("Proposta criada")



}





setOpen(false)

setEditando(null)



setForm({

cliente_id:"",
titulo:"",
descricao:"",
valor:0,
status:"Pendente",
validade:""

})



carregar()



}







async function excluir(id:string){


const {error}=await supabase

.from("propostas")

.delete()

.eq("id",id)



if(error){

toast.error(error.message)

return

}



toast.success("Proposta excluída")

carregar()


}







async function aprovar(proposta:any){



const {error}=await supabase

.from("vendas")

.insert({

cliente_id:proposta.cliente_id,

valor:proposta.valor,

status:"Aberta",

user_id:(await supabase.auth.getUser()).data.user?.id

})




if(error){

toast.error(error.message)

return

}





await supabase

.from("propostas")

.update({

status:"Aprovada"

})

.eq("id",proposta.id)




toast.success("Venda criada!")

carregar()



}









function editar(p:any){



setEditando(p)



setForm({

cliente_id:p.cliente_id,

titulo:p.titulo,

descricao:p.descricao || "",

valor:p.valor || 0,

status:p.status,

validade:p.validade || ""

})



setOpen(true)



}








return(


<div className="space-y-6 p-6">



<div className="flex justify-between items-center">


<div>

<h1 className="text-3xl font-bold">

Propostas

</h1>


<p className="text-muted-foreground">

Controle suas negociações

</p>


</div>



<Button onClick={()=>{

setEditando(null)

setOpen(true)

}}>


<Plus className="mr-2 h-4 w-4"/>

Nova proposta


</Button>



</div>









<div className="grid md:grid-cols-3 gap-4">



<Card>

<CardHeader>

<CardTitle>

Total

</CardTitle>

</CardHeader>


<CardContent>

<h2 className="text-3xl font-bold">

{propostas.length}

</h2>

</CardContent>


</Card>





<Card>

<CardHeader>

<CardTitle>

Em negociação

</CardTitle>

</CardHeader>


<CardContent>

<h2 className="text-3xl font-bold">

{

propostas.filter(
p=>p.status!=="Aprovada"
).length

}

</h2>


</CardContent>


</Card>







<Card>

<CardHeader>

<CardTitle>

Valor total

</CardTitle>

</CardHeader>


<CardContent>


<h2 className="text-3xl font-bold">

R$ {

propostas.reduce(
(a,p)=>a+(p.valor || 0),0
)

}

</h2>


</CardContent>


</Card>



</div>










<div className="space-y-4">



{

propostas.map((p)=>(



<Card key={p.id}>


<CardHeader>


<CardTitle className="flex justify-between">


{p.titulo}


<span className="text-sm">

{p.status}

</span>


</CardTitle>


</CardHeader>





<CardContent>


<p>

Cliente: {p.clientes?.nome}

</p>


<p>

Valor: R$ {p.valor}

</p>



<p className="mt-2 text-muted-foreground">

{p.descricao}

</p>




<div className="flex gap-2 mt-4">



<Button

variant="outline"

onClick={()=>editar(p)}

>


<Pencil className="h-4 w-4"/>


</Button>






{p.status !== "Aprovada" && (



<Button

onClick={()=>aprovar(p)}

>


<CheckCircle className="mr-2 h-4 w-4"/>

Aprovar


</Button>



)}






<Button

variant="destructive"

onClick={()=>excluir(p.id)}

>


<Trash2 className="h-4 w-4"/>


</Button>




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

{editando ? "Editar proposta":"Nova proposta"}

</DialogTitle>


</DialogHeader>





<select

className="border p-2 rounded"

value={form.cliente_id}

onChange={(e)=>setForm({

...form,

cliente_id:e.target.value

})}

>


<option value="">

Selecione cliente

</option>



{

clientes.map(c=>(


<option key={c.id} value={c.id}>

{c.nome}

</option>



))

}



</select>







<Input

placeholder="Título"

value={form.titulo}

onChange={(e)=>setForm({

...form,

titulo:e.target.value

})}

/>






<Textarea

placeholder="Descrição"

value={form.descricao}

onChange={(e)=>setForm({

...form,

descricao:e.target.value

})}

/>







<Input

type="number"

placeholder="Valor"

value={form.valor}

onChange={(e)=>setForm({

...form,

valor:Number(e.target.value)

})}

/>







<Input

type="date"

value={form.validade}

onChange={(e)=>setForm({

...form,

validade:e.target.value

})}

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
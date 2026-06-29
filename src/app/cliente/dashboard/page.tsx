"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function ClienteDashboard(){

const supabase=createClient()
const router=useRouter()


const [cliente,setCliente]=useState<any>(null)
const [posts,setPosts]=useState<any[]>([])
const [loading,setLoading]=useState(true)



useEffect(()=>{
carregarDados()
},[])



async function carregarDados(){

setLoading(true)


const {data:userData}=await supabase.auth.getUser()

const user=userData.user


if(!user){

router.push("/cliente/login")
return

}



const {data:clienteData,error}=await supabase
.from("clientes")
.select("*")
.eq("user_id",user.id)
.single()



if(error || !clienteData){

toast.error("Cliente não encontrado")
return

}



setCliente(clienteData)



const {data:postsData}=await supabase
.from("posts")
.select("*")
.eq("cliente_id",clienteData.id)
.order("created_at",{ascending:false})


setPosts(postsData || [])



setLoading(false)


}



async function atualizarStatus(
id:string,
status:string
){


await supabase
.from("posts")
.update({
status
})
.eq("id",id)



toast.success(
status==="aprovado"
?"Conteúdo aprovado"
:"Solicitação enviada"
)



carregarDados()


}



if(loading){

return(
<div className="p-8">
Carregando painel...
</div>
)

}



const aprovados =
posts.filter(p=>p.status==="aprovado").length


const pendentes =
posts.filter(p=>!p.status || p.status==="pendente").length


const rejeitados =
posts.filter(p=>p.status==="rejeitado").length



return(


<div className="p-6 space-y-8">


{/* CABEÇALHO */}

<div className="bg-black text-white rounded-xl p-6">

<h1 className="text-3xl font-bold">
Olá, {cliente.nome}
</h1>


<p className="text-gray-300 mt-2">
Painel de acompanhamento de conteúdos
</p>


<div className="grid md:grid-cols-3 gap-4 mt-5">


<div className="bg-white/10 p-4 rounded">
Empresa
<br/>
<b>{cliente.empresa || "-"}</b>
</div>


<div className="bg-white/10 p-4 rounded">
Instagram
<br/>
<b>{cliente.instagram || "-"}</b>
</div>


<div className="bg-white/10 p-4 rounded">
Plano mensal
<br/>
<b>
R$ {cliente.valor_mensal || 0}
</b>
</div>



</div>


</div>





{/* INDICADORES */}


<div className="grid md:grid-cols-3 gap-4">


<div className="border rounded-xl p-5">

<h3>
Pendentes
</h3>

<strong className="text-3xl">
{pendentes}
</strong>

</div>



<div className="border rounded-xl p-5">

<h3>
Aprovados
</h3>

<strong className="text-3xl text-green-600">
{aprovados}
</strong>

</div>



<div className="border rounded-xl p-5">

<h3>
Alterações
</h3>

<strong className="text-3xl text-red-600">
{rejeitados}
</strong>

</div>


</div>






{/* POSTS */}



<div>

<h2 className="text-2xl font-bold mb-4">
Conteúdos
</h2>



<div className="grid md:grid-cols-2 gap-5">


{
posts.length===0 && (

<p>
Nenhum conteúdo enviado ainda.
</p>

)

}




{
posts.map(post=>(


<div
key={post.id}
className="border rounded-xl p-5 shadow-sm space-y-3"
>



<div className="flex justify-between">


<h3 className="font-bold text-lg">
{post.titulo}
</h3>



<span
className={
post.status==="aprovado"
?
"text-green-600"
:
post.status==="rejeitado"
?
"text-red-600"
:
"text-yellow-600"
}
>

{post.status || "pendente"}

</span>


</div>




<p className="text-gray-600">
{post.conteudo}
</p>



<div className="text-sm">

📌 {post.tipo}

<br/>

📅 {post.data_post}

</div>




<div className="flex gap-3 pt-3">


<button

onClick={()=>atualizarStatus(
post.id,
"aprovado"
)}

className="
bg-green-600
text-white
px-4
py-2
rounded
"

>

Aprovar

</button>



<button

onClick={()=>atualizarStatus(
post.id,
"rejeitado"
)}

className="
bg-red-600
text-white
px-4
py-2
rounded
"

>

Pedir alteração

</button>


</div>



</div>


))

}



</div>


</div>



</div>


)


}
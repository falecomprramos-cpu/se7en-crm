"use client"

import {useEffect,useState} from "react"
import {createClient} from "@/lib/supabase/client"

import {
Card,
CardContent,
CardHeader,
CardTitle
} from "@/components/ui/card"

import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Input} from "@/components/ui/input"

import {
Plus,
Search,
CalendarDays,
Check,
X
} from "lucide-react"

import {toast} from "sonner"



export default function PostsPage(){


const supabase=createClient()


const [clientes,setClientes]=useState<any[]>([])
const [posts,setPosts]=useState<any[]>([])

const [busca,setBusca]=useState("")


const [form,setForm]=useState({

cliente_id:"",
titulo:"",
conteudo:"",
tipo:"",
data_post:""

})



useEffect(()=>{

carregar()

},[])



async function carregar(){


const {data:cli}=await supabase
.from("clientes")
.select("*")
.order("nome")


setClientes(cli || [])



const {data:p}=await supabase
.from("posts")
.select("*,clientes(nome,empresa)")
.order("created_at",{ascending:false})


setPosts(p || [])


}



async function criarPost(){


if(!form.cliente_id || !form.titulo){

toast.error("Cliente e título são obrigatórios")
return

}



const {error}=await supabase
.from("posts")
.insert([{

...form,
status:"pendente"

}])


if(error){

toast.error(error.message)
return

}



// cria agenda


await supabase
.from("agenda")
.insert([{

titulo:`Post: ${form.titulo}`,
descricao:form.conteudo,
data_evento:form.data_post,
tipo:"post",
cliente_id:form.cliente_id

}])



toast.success("Post criado!")


setForm({

cliente_id:"",
titulo:"",
conteudo:"",
tipo:"",
data_post:""

})


carregar()


}




async function alterarStatus(id:string,status:string){


await supabase
.from("posts")
.update({status})
.eq("id",id)


carregar()


}



const filtrados=posts.filter(p=>

p.titulo
.toLowerCase()
.includes(busca.toLowerCase())

)



return (


<div className="space-y-6">


<div className="flex justify-between items-center">


<div>

<h1 className="text-3xl font-bold">
Posts
</h1>

<p className="text-muted-foreground">
{posts.length} conteúdos cadastrados
</p>

</div>



</div>





<Card>

<CardHeader>

<CardTitle>
Criar novo conteúdo
</CardTitle>

</CardHeader>


<CardContent className="space-y-3">


<select

className="w-full border rounded p-2"

value={form.cliente_id}

onChange={e=>
setForm({...form,cliente_id:e.target.value})
}

>


<option value="">
Selecionar cliente
</option>


{clientes.map(c=>(

<option key={c.id} value={c.id}>

{c.nome}

</option>

))}


</select>




<Input

placeholder="Título"

value={form.titulo}

onChange={e=>
setForm({...form,titulo:e.target.value})
}

/>



<textarea

className="w-full border rounded p-3"

placeholder="Descrição do conteúdo"

value={form.conteudo}

onChange={e=>
setForm({...form,conteudo:e.target.value})
}

/>



<Input

placeholder="Tipo (Reels, Post, Story)"

value={form.tipo}

onChange={e=>
setForm({...form,tipo:e.target.value})
}

/>



<Input

type="date"

value={form.data_post}

onChange={e=>
setForm({...form,data_post:e.target.value})
}

/>



<Button

onClick={criarPost}

>

<Plus className="mr-2 h-4"/>

Criar Post

</Button>



</CardContent>

</Card>







<Card>


<CardHeader>


<div className="flex gap-3">


<Search/>


<Input

placeholder="Buscar post..."

value={busca}

onChange={e=>setBusca(e.target.value)}

 />


</div>


</CardHeader>




<CardContent className="space-y-4">



{filtrados.map(post=>(



<div

key={post.id}

className="border rounded-xl p-4 space-y-3"

>


<div className="flex justify-between">


<div>


<h2 className="font-bold text-lg">

{post.titulo}

</h2>


<p className="text-sm text-muted-foreground">

{post.clientes?.nome}

</p>


</div>



<Badge>

{post.status}

</Badge>


</div>




<p>

{post.conteudo}

</p>



<div className="flex gap-2 text-sm">


<span>

📌 {post.tipo}

</span>


<span>

<CalendarDays className="inline h-4"/>

{post.data_post}

</span>


</div>





<div className="flex gap-2">


<Button

size="sm"

onClick={()=>alterarStatus(post.id,"aprovado")}

className="bg-green-600"

>

<Check/>

Aprovar

</Button>




<Button

size="sm"

variant="destructive"

onClick={()=>alterarStatus(post.id,"rejeitado")}

>

<X/>

Rejeitar

</Button>



<Button

size="sm"

onClick={()=>alterarStatus(post.id,"publicado")}

>

Publicado

</Button>


</div>




</div>


))}


</CardContent>


</Card>



</div>


)


}
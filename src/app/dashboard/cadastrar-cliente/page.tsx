"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"


export default function CadastrarCliente(){

const supabase = createClient()


const [form,setForm]=useState({

nome:"",
email:"",
telefone:"",
empresa:""

})


const [senha,setSenha]=useState("")

const [acesso,setAcesso]=useState("")

const [loading,setLoading]=useState(false)



function gerarSenha(){

const nova =
Math.random()
.toString(36)
.slice(-8)

setSenha(nova)

}



function handleChange(e:any){

setForm({

...form,

[e.target.name]:e.target.value

})

}




async function cadastrar(e:any){

e.preventDefault()

setLoading(true)



let senhaFinal = senha


if(!senhaFinal){

senhaFinal =
Math.random()
.toString(36)
.slice(-8)

}




const {data:auth,error:authError}=

await supabase.auth.signUp({

email:form.email,

password:senhaFinal

})



if(authError){

toast.error(authError.message)

setLoading(false)

return

}




const {error}=await supabase

.from("clientes")

.insert({

nome:form.nome,

email:form.email,

telefone:form.telefone,

empresa:form.empresa,

user_id:auth.user?.id,

senha_acesso:senhaFinal,

status:"ativo",

status_cliente:"ativo"


})




if(error){

toast.error(error.message)

setLoading(false)

return

}



setAcesso(

`Email: ${form.email}

Senha: ${senhaFinal}`

)



toast.success("Cliente criado")


setLoading(false)


}



return(

<div className="p-6 max-w-xl space-y-5">


<h1 className="text-2xl font-bold">
Cadastrar Cliente
</h1>



<form onSubmit={cadastrar} className="space-y-3">



<input
name="nome"
placeholder="Nome"
onChange={handleChange}
className="w-full border p-3 rounded"
/>


<input
name="empresa"
placeholder="Empresa"
onChange={handleChange}
className="w-full border p-3 rounded"
/>



<input
name="telefone"
placeholder="Telefone"
onChange={handleChange}
className="w-full border p-3 rounded"
/>



<input
name="email"
placeholder="Email"
onChange={handleChange}
className="w-full border p-3 rounded"
/>




<div className="flex gap-2">

<input

value={senha}

readOnly

placeholder="Senha"

className="flex-1 border p-3 rounded"

/>


<button

type="button"

onClick={gerarSenha}

className="border px-4 rounded"

>

Gerar

</button>


</div>



<button

disabled={loading}

className="bg-black text-white w-full p-3 rounded"

>

{loading?"Criando...":"Cadastrar Cliente"}

</button>



</form>



{acesso && (

<div className="border p-4 mt-5 rounded">

<h2 className="font-bold">
Acesso:
</h2>

<pre>
{acesso}
</pre>


<button

onClick={()=>navigator.clipboard.writeText(acesso)}

className="bg-green-600 text-white px-4 py-2 mt-3 rounded"

>

Copiar acesso

</button>


</div>

)}



</div>

)


}
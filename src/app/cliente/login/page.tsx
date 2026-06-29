"use client"

import {useState} from "react"
import {createClient} from "@/lib/supabase/client"
import {useRouter} from "next/navigation"
import {toast} from "sonner"


export default function LoginCliente(){


const supabase=createClient()

const router=useRouter()


const [email,setEmail]=useState("")
const [senha,setSenha]=useState("")



async function entrar(){


const {data,error}=await supabase.auth.signInWithPassword({

email,
password:senha

})


if(error){

toast.error(error.message)
return

}



const {data:cliente}=await supabase
.from("clientes")
.select("*")
.eq("user_id", data.user.id)
.maybeSingle()



if(!cliente){

toast.error("Esse acesso não é de cliente")

return

}



toast.success("Login realizado")


router.push("/cliente/dashboard")

}


return (

<div className="p-6 max-w-md mx-auto space-y-4">


<h1 className="text-2xl font-bold">
Login Cliente
</h1>


<input

className="border p-3 w-full rounded"

placeholder="Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

/>



<input

className="border p-3 w-full rounded"

placeholder="Senha"

type="password"

value={senha}

onChange={(e)=>setSenha(e.target.value)}

/>



<button

onClick={entrar}

className="bg-black text-white w-full p-3 rounded"

>

Entrar

</button>



</div>

)


}
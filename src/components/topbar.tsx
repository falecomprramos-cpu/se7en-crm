"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getInitials } from "@/lib/utils"

export function Topbar() {

  const [nome,setNome] = useState("Usuário")

  const supabase = createClient()


  useEffect(()=>{


    async function loadUser(){


      const {
        data:{
          user
        }
      } = await supabase.auth.getUser()



      if(!user){
        return
      }



      const {
        data:perfil,
        error
      } = await supabase

      .from("profiles")

      .select("nome")

      .eq("id",user.id)

      .maybeSingle()



      if(error){

        console.log("Erro profile:",error)

        return

      }



      if(perfil?.nome){

        setNome(perfil.nome)

      }


    }


    loadUser()


  },[])



  return (

<header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card/50 backdrop-blur-xl px-6">


<div className="relative flex-1 max-w-md">

<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>


<Input

placeholder="Buscar clientes, tarefas..."

className="pl-10"

/>


</div>



<div className="flex items-center gap-4 ml-auto">


<button>

<Bell/>

</button>



<div className="flex items-center gap-3">


<Avatar>

<AvatarFallback>

{getInitials(nome)}

</AvatarFallback>

</Avatar>


<div>

<p className="text-sm font-medium">

{nome}

</p>


<p className="text-xs text-muted-foreground">

Online

</p>


</div>


</div>


</div>


</header>

  )

}
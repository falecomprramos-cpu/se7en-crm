"use client"

import {
  DndContext,
  DragEndEvent,
  useDroppable,
  useDraggable,
  closestCenter
} from "@dnd-kit/core"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"


const etapas = [
  { id:"novo", nome:"Novo" },
  { id:"contato", nome:"Em contato" },
  { id:"proposta", nome:"Proposta" },
  { id:"fechado", nome:"Fechado" },
  { id:"perdido", nome:"Perdido" },
]



function LeadCard({
  lead,
  deletarLead
}:any){


const {
  attributes,
  listeners,
  setNodeRef
}=useDraggable({
  id:String(lead.id)
})



return (

<Card
ref={setNodeRef}
className="select-none"
>


<CardHeader
{...listeners}
{...attributes}
className="cursor-grab"
>

<CardTitle>
{lead.nome}
</CardTitle>


</CardHeader>



<CardContent>


<p>
📞 {lead.telefone || "Sem telefone"}
</p>


<p>
✉ {lead.email || "Sem email"}
</p>


<p>
Status: {lead.status}
</p>



<button

onClick={(e)=>{

e.stopPropagation()

deletarLead(lead.id)

}}

className="mt-3 bg-red-600 text-white px-3 py-1 rounded"

>

Excluir

</button>


</CardContent>


</Card>


)

}




function Coluna({

etapa,
leads,
deletarLead

}:any){


const drop = useDroppable({

id:etapa.id

})


return (

<div

ref={drop.setNodeRef}

className="bg-gray-200 rounded p-3 min-h-[350px]"

>


<h2 className="font-bold mb-3">

{etapa.nome}

</h2>



<div className="space-y-3">


{

leads.map((lead:any)=>(

<LeadCard

key={lead.id}

lead={lead}

deletarLead={deletarLead}

/>

))

}


</div>


</div>

)

}




export default function LeadsKanban({

leads,
atualizarStatus,
deletarLead

}:any){



function moverLead(event: DragEndEvent){

console.log("EVENTO DRAG COMPLETO")

console.log("LEAD:", event.active.id)

console.log("DESTINO:", event.over?.id)


if(!event.over){

console.log("NÃO ACHOU COLUNA")

return

}


atualizarStatus(
String(event.active.id),
String(event.over.id)
)


}



return (

<DndContext

collisionDetection={closestCenter}

onDragEnd={moverLead}

>


<div className="grid grid-cols-1 md:grid-cols-5 gap-4">


{

etapas.map((etapa)=>(


<Coluna

key={etapa.id}

etapa={etapa}

leads={
leads.filter(
(l:any)=>l.status===etapa.id
)
}

deletarLead={deletarLead}

/>


))


}


</div>


</DndContext>


)


}
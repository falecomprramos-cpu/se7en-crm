"use client"

import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"

import "react-big-calendar/lib/css/react-big-calendar.css"

import { useEffect,useState } from "react"
import { createClient } from "@/lib/supabase/client"


const locales = {
 "pt-BR": ptBR,
}


const localizer = dateFnsLocalizer({

format,
parse,
startOfWeek,
getDay,
locales,

})


export default function CalendarioPage(){

const supabase=createClient()

const [eventos,setEventos]=useState<any[]>([])


useEffect(()=>{

buscarEventos()

},[])



async function buscarEventos(){


const {data}=await supabase

.from("agenda")

.select("*")


const eventosFormatados =
(data || []).map((item)=>({

title:item.titulo,

start:new Date(item.data_evento+"T"+item.horario),

end:new Date(item.data_evento+"T"+item.horario)

}))


setEventos(eventosFormatados)


}



return (

<div className="p-6">

<h1 className="text-3xl font-bold mb-6">

Calendário da Agência

</h1>


<div className="bg-white rounded-xl p-4 text-black">


<Calendar

localizer={localizer}

events={eventos}

startAccessor="start"

endAccessor="end"

style={{height:700}}

views={["month"]}

defaultView="month"

/>


</div>


</div>

)


}
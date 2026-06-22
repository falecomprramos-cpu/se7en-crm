"use client"

import { useEffect, useState } from "react"

import { Calendar, dateFnsLocalizer } from "react-big-calendar"

import { format, parse, startOfWeek, getDay } from "date-fns"

import { ptBR } from "date-fns/locale"

import "react-big-calendar/lib/css/react-big-calendar.css"

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

export default function CalendarioPage() {
  const supabase = createClient()

  const [eventos, setEventos] = useState<any[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)

  const [titulo, setTitulo] = useState("")
  const [tipo, setTipo] = useState("")
  const [clienteId, setClienteId] = useState("")
  const [data, setData] = useState("")
  const [horario, setHorario] = useState("")

  const [dataCalendario, setDataCalendario] = useState(new Date())
  const [eventoEditando, setEventoEditando] = useState<any>(null)

  useEffect(() => {
    buscarEventos()
    buscarClientes()
  }, [])

  async function buscarClientes() {
    const { data } = await supabase.from("clientes").select("*")
    setClientes(data || [])
  }

  async function buscarEventos() {
    const { data } = await supabase.from("agenda").select("*")

    const lista = (data || []).map((item) => ({
      id: item.id,
      title: `${item.tipo} - ${item.titulo}`,
      start: new Date(item.data_evento + "T" + item.horario),
      end: new Date(item.data_evento + "T" + item.horario),
    }))

    setEventos(lista)
  }

  async function excluirEvento(id: string) {
    const { error } = await supabase.from("agenda").delete().eq("id", id)

    if (error) {
      alert(error.message)
      return
    }

    alert("Evento excluído")
    buscarEventos()
  }

  async function criarEvento() {
    const { error } = await supabase.from("agenda").insert({
      titulo,
      tipo,
      cliente_id: clienteId || null,
      data_evento: data,
      horario,
    })

    if (error) {
      alert(error.message)
      return
    }

    alert("Evento criado")

    setTitulo("")
    setTipo("")
    setClienteId("")
    setData("")
    setHorario("")
    setMostrarForm(false)

    buscarEventos()
  }

  async function editarEvento() {
    const { error } = await supabase
      .from("agenda")
      .update({
        titulo,
        tipo,
        cliente_id: clienteId || null,
        data_evento: data,
        horario,
      })
      .eq("id", eventoEditando.id)

    if (error) {
      alert(error.message)
      return
    }

    alert("Evento atualizado")

    setEventoEditando(null)
    setTitulo("")
    setTipo("")
    setClienteId("")
    setData("")
    setHorario("")

    buscarEventos()
  }

  function EventoCustom({ event }: any) {
    return (
      <div className="text-[11px] p-1 space-y-1">
        <div className="font-semibold">{event.title}</div>

        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()

              setEventoEditando(event)

              const partes = event.title.split(" - ")

              setTipo(partes[0])
              setTitulo(partes[1])

              setData(event.start.toISOString().split("T")[0])
              setHorario(event.start.toTimeString().slice(0, 5))

              setMostrarForm(true)
            }}
            className="bg-blue-600 text-white px-1 py-[2px] rounded text-[10px]"
          >
            Editar
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              excluirEvento(event.id)
            }}
            className="bg-red-600 text-white px-1 py-[2px] rounded text-[10px]"
          >
            Excluir
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Calendário</h1>

        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Novo Evento
        </button>
      </div>

      {mostrarForm && (
        <div className="border rounded p-4 space-y-3">
          <input
            className="border p-2 w-full"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <select
            className="border p-2 w-full"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option>Tipo</option>
            <option>Reunião</option>
            <option>Gravação</option>
            <option>Post</option>
            <option>Follow-up</option>
            <option>Entrega</option>
          </select>

          <select
            className="border p-2 w-full"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
          >
            <option value="">Cliente</option>

            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="border p-2 w-full"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />

          <input
            type="time"
            className="border p-2 w-full"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
          />

          <button
            onClick={eventoEditando ? editarEvento : criarEvento}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {eventoEditando ? "Atualizar Evento" : "Salvar Evento"}
          </button>
        </div>
      )}

      <div className="bg-white text-black rounded-xl p-4">
        <Calendar
          localizer={localizer}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          defaultView="month"
          views={["month", "week", "day", "agenda"]}
          date={dataCalendario}
          onNavigate={(date: Date) => setDataCalendario(date)}
          components={{
            event: EventoCustom,
          }}
        />
      </div>
    </div>
  )
}
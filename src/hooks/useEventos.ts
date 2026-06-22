"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export default function useEventos() {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from("eventos")
        .select("*")

      if (error) {
        console.log(error)
        return
      }

      const formatados = data.map((e: any) => ({
        id: e.id,
        title: e.title,
        start: new Date(e.start),
        end: new Date(e.end),
      }))

      setEvents(formatados)
    }

    load()
  }, [])

  async function deleteEvento(id: string) {
    const { error } = await supabase
      .from("eventos")
      .delete()
      .eq("id", id)

    if (error) {
      console.log(error)
      return
    }

    setEvents((prev) => prev.filter((e: any) => e.id !== id))
  }

  return { events, setEvents, deleteEvento }
}
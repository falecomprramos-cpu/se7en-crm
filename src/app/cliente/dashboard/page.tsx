"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function ClienteDashboard() {
  const supabase = createClient()
  const router = useRouter()

  const [posts, setPosts] = useState<any[]>([])
  const [cliente, setCliente] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarDados()
  }, [])

  async function carregarDados() {
    setLoading(true)

    // 🔐 usuário logado
    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user

    if (!user) {
      router.push("/cliente/login")
      return
    }

    // 👤 cliente vinculado ao auth
    const { data: clienteData } = await supabase
      .from("clientes")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()

    if (!clienteData) {
      setLoading(false)
      return
    }

    setCliente(clienteData)

    // 📦 posts do cliente
    const { data: postsData } = await supabase
      .from("posts")
      .select("*")
      .eq("cliente_id", clienteData.id)
      .order("created_at", { ascending: false })

    setPosts(postsData || [])

    setLoading(false)
  }

  async function atualizarStatus(id: string, status: string) {
    await supabase
      .from("posts")
      .update({ status })
      .eq("id", id)

    carregarDados()
  }

  if (loading) {
    return (
      <div className="p-6">
        <p>Carregando área do cliente...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          Área do Cliente
        </h1>

        {cliente && (
          <p className="text-muted-foreground">
            Bem-vindo, {cliente.nome}
          </p>
        )}
      </div>

      {/* LISTA DE POSTS */}
      <div className="space-y-4">

        {posts.length === 0 && (
          <p className="text-muted-foreground">
            Nenhum conteúdo disponível no momento.
          </p>
        )}

        {posts.map((post) => (
          <div
            key={post.id}
            className="border rounded-lg p-4 space-y-2"
          >

            <h2 className="font-bold text-lg">
              {post.titulo}
            </h2>

            <p className="text-sm text-muted-foreground">
              {post.conteudo}
            </p>

            {/* STATUS */}
            <p className={
              post.status === "aprovado"
                ? "text-green-600"
                : post.status === "rejeitado"
                ? "text-red-600"
                : "text-yellow-600"
            }>
              Status: {post.status || "pendente"}
            </p>

            {/* AÇÕES */}
            <div className="flex gap-2 pt-2">

              <button
                onClick={() => atualizarStatus(post.id, "aprovado")}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Aprovar
              </button>

              <button
                onClick={() => atualizarStatus(post.id, "rejeitado")}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Rejeitar
              </button>

            </div>

          </div>
        ))}

      </div>
    </div>
  )
}
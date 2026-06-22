"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function PostsPage() {
  const supabase = createClient()

  const [clientes, setClientes] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])

  const [clienteId, setClienteId] = useState("")
  const [titulo, setTitulo] = useState("")
  const [conteudo, setConteudo] = useState("")
  const [tipo, setTipo] = useState("")
  const [dataPost, setDataPost] = useState("")

  useEffect(() => {
    buscarClientes()
    buscarPosts()
  }, [])

  async function buscarClientes() {
    const { data } = await supabase.from("clientes").select("*")
    setClientes(data || [])
  }

  async function buscarPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*, clientes(nome, empresa)")
      .order("created_at", { ascending: false })

    setPosts(data || [])
  }

  async function criarPost() {
  if (!titulo || !clienteId) {
    alert("Preencha cliente e título")
    return
  }

  // 1. cria post
  const { data: post, error } = await supabase
    .from("posts")
    .insert([
      {
        cliente_id: clienteId,
        titulo,
        conteudo,
        tipo,
        data_post: dataPost,
        status: "pendente",
      },
    ])
    .select()
    .single()

  if (error) {
    alert(error.message)
    return
  }

  // 2. cria evento na agenda automaticamente
  await supabase.from("agenda").insert([
    {
      titulo: `Post: ${titulo}`,
      descricao: conteudo,
      data_evento: dataPost,
      tipo: "post",
      post_id: post.id,
    },
  ])

  alert("Post criado e enviado para agenda!")

  setClienteId("")
  setTitulo("")
  setConteudo("")
  setTipo("")
  setDataPost("")

  buscarPosts()
}

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-2xl font-bold">
        Posts (Criação de Conteúdo)
      </h1>

      {/* FORM */}
      <div className="space-y-3 border p-4 rounded-lg">

        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          className="w-full border p-2"
        >
          <option value="">Selecione o cliente</option>

          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome} ({c.empresa})
            </option>
          ))}
        </select>

        <input
          placeholder="Título"
          className="w-full border p-2"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <textarea
          placeholder="Conteúdo"
          className="w-full border p-2"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
        />

        <input
          placeholder="Tipo (post, story, reel...)"
          className="w-full border p-2"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        />

        <input
          type="date"
          className="w-full border p-2"
          value={dataPost}
          onChange={(e) => setDataPost(e.target.value)}
        />

        <button
          onClick={criarPost}
          className="bg-black text-white px-4 py-2"
        >
          Criar Post
        </button>

      </div>

      {/* LISTA */}
      <div className="space-y-4">

        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded-lg">

            <h2 className="font-bold">{post.titulo}</h2>

            <p className="text-sm text-gray-500">
              {post.clientes?.nome} ({post.clientes?.empresa})
            </p>

            <p className="mt-2">{post.conteudo}</p>

            <p className="text-sm mt-2">
              Tipo: {post.tipo} | Status:{" "}
              <span className="text-yellow-600">
                {post.status}
              </span>
            </p>

          </div>
        ))}

      </div>

    </div>
  )
}
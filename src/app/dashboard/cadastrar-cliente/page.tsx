"use client"

import { useState } from "react"

export default function CadastrarCliente() {
  const [form, setForm] = useState({
    nome: "",
    empresa: "",
    whatsapp: "",
    instagram: "",
    segmento: "",
    email: "",
  })

  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("Cliente cadastrado:", form)

      alert("Cliente cadastrado com sucesso!")

      setForm({
        nome: "",
        empresa: "",
        whatsapp: "",
        instagram: "",
        segmento: "",
        email: "",
      })
    } catch (error) {
      alert("Erro ao cadastrar cliente")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Cadastro de Clientes</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          name="empresa"
          placeholder="Empresa"
          value={form.empresa}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          name="whatsapp"
          placeholder="WhatsApp"
          value={form.whatsapp}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          name="instagram"
          placeholder="Instagram"
          value={form.instagram}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          name="segmento"
          placeholder="Segmento"
          value={form.segmento}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-lg"
        >
          {loading ? "Salvando..." : "Cadastrar Cliente"}
        </button>

      </form>
    </div>
  )
}
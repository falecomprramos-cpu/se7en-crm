"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function ClienteLogin() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)

  async function login() {
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    setLoading(false)

    router.push("/cliente/dashboard")
  }

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">

      <h1 className="text-2xl font-bold">
        Login do Cliente
      </h1>

      <input
        className="w-full border p-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border p-2"
        placeholder="Senha"
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      <button
        onClick={login}
        disabled={loading}
        className="w-full bg-black text-white p-2"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>

    </div>
  )
}
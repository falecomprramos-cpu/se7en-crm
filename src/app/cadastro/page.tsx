"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { toast } from "sonner"
import { Loader2, Mail, Lock, User } from "lucide-react"

export default function CadastroPage() {

  const router = useRouter()
  const supabase = createClient()

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)


  async function handleCadastro(e: React.FormEvent) {

    e.preventDefault()
    setLoading(true)

    try {

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome,
            role: "admin"
          }
        }
      })


      if (error) {
        toast.error(error.message)
        return
      }


      if (data.user) {
        toast.success("Conta criada com sucesso!")
        router.push("/login")
      }


    } catch (error) {

      toast.error("Erro inesperado")

    } finally {

      setLoading(false)

    }

  }


  return (

    <div className="flex min-h-screen items-center justify-center p-4">

      <div className="w-full max-w-md">

        <div className="rounded-2xl border p-8">


          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>


          <form onSubmit={handleCadastro} className="space-y-5">


            <div>

              <Label>Nome</Label>

              <div className="relative">

                <User className="absolute left-3 top-3 h-4 w-4" />

                <Input
                  className="pl-10"
                  value={nome}
                  onChange={(e)=>setNome(e.target.value)}
                  required
                />

              </div>

            </div>



            <div>

              <Label>Email</Label>

              <div className="relative">

                <Mail className="absolute left-3 top-3 h-4 w-4" />

                <Input
                  className="pl-10"
                  type="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  required
                />

              </div>

            </div>



            <div>

              <Label>Senha</Label>

              <div className="relative">

                <Lock className="absolute left-3 top-3 h-4 w-4" />

                <Input
                  className="pl-10"
                  type="password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  minLength={6}
                  required
                />

              </div>

            </div>



            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >

              {loading ? (

                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Criando...
                </>

              ) : (

                "Criar conta"

              )}

            </Button>


          </form>


        </div>

      </div>

    </div>

  )

}



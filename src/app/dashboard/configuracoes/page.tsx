"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Save, Settings } from "lucide-react"

export default function ConfiguracoesPage() {

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")

  function salvar() {
    alert("Configurações salvas!")
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Configurações
        </h1>

        <p className="text-muted-foreground mt-1">
          Gerencie suas informações e preferências do sistema.
        </p>
      </div>


      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">

        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Perfil
          </CardTitle>
        </CardHeader>


        <CardContent className="space-y-4">

          <div>
            <Label>Nome</Label>

            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
            />
          </div>


          <div>
            <Label>E-mail</Label>

            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>


          <Button
            onClick={salvar}
            className="bg-gold-gradient text-black font-semibold"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>


        </CardContent>

      </Card>


      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">

        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Sistema
          </CardTitle>
        </CardHeader>


        <CardContent>
          <p className="text-muted-foreground">
            SE7EN CRM 1.0
          </p>
        </CardContent>


      </Card>


    </div>
  )
}
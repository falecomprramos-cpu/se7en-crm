import { ReactNode } from "react"

export default function ClienteLayout({
  children,
}: {
  children: ReactNode
}) {


return (

<div className="min-h-screen bg-background">


<header className="border-b p-4">

<h1 className="font-bold text-xl">
Área do Cliente
</h1>

</header>


<main>

{children}

</main>


</div>

)

}
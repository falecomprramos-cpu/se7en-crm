export type Lead = {
  id: string
  nome: string
  empresa?: string
  whatsapp: string
  instagram?: string
  segmento?: string
  origem: "Instagram" | "Indicação" | "Anúncio" | "Site"
  status: "novo" | "contato" | "proposta" | "ganho" | "perdido"
  created_at: string
}
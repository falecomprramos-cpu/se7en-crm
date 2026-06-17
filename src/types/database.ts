export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============= USUÁRIOS =============
export interface Usuario {
  id: string
  email: string
  nome: string
  avatar_url?: string
  cargo?: string
  role: 'admin' | 'gerente' | 'membro' | 'visualizador'
  telefone?: string
  ativo: boolean
  criado_em: string
  atualizado_em: string
}

// ============= CLIENTES =============
export type ClienteStatus = 'lead' | 'proposta' | 'ativo' | 'pausado' | 'churn'
export type ClienteOrigem = 'indicacao' | 'site' | 'instagram' | 'google' | 'facebook' | 'outro'

export interface Cliente {
  id: string
  nome: string
  empresa?: string
  email?: string
  telefone?: string
  whatsapp?: string
  site?: string
  instagram?: string
  cnpj_cpf?: string
  endereco?: string
  cidade?: string
  estado?: string
  status: ClienteStatus
  origem?: ClienteOrigem
  segmento?: string
  valor_mensal: number
  responsavel_id?: string
  observacoes?: string
  criado_em: string
  atualizado_em: string
  responsavel?: Usuario
}

// ============= SERVIÇOS =============
export interface Servico {
  id: string
  nome: string
  descricao?: string
  preco_base?: number
  ativo: boolean
}

// ============= PROJETOS =============
export type ProjetoStatus = 'planejamento' | 'em_andamento' | 'pausado' | 'concluido' | 'cancelado'

export interface Projeto {
  id: string
  cliente_id: string
  servico_id?: string
  nome: string
  descricao?: string
  status: ProjetoStatus
  data_inicio?: string
  data_prazo?: string
  data_conclusao?: string
  valor?: number
  responsavel_id?: string
  progresso: number
  criado_em: string
  atualizado_em: string
  cliente?: Cliente
  servico?: Servico
  responsavel?: Usuario
}

// ============= TAREFAS =============
export type TarefaPrioridade = 'baixa' | 'media' | 'alta' | 'urgente'
export type TarefaStatus = 'pendente' | 'em_andamento' | 'concluida' | 'cancelada'

export interface Tarefa {
  id: string
  titulo: string
  descricao?: string
  cliente_id?: string
  projeto_id?: string
  responsavel_id?: string
  criador_id?: string
  prioridade: TarefaPrioridade
  status: TarefaStatus
  data_vencimento?: string
  concluida_em?: string
  criado_em: string
  atualizado_em: string
  cliente?: Cliente
  projeto?: Projeto
  responsavel?: Usuario
}

// ============= INTERAÇÕES =============
export type InteracaoTipo = 'ligacao' | 'email' | 'whatsapp' | 'reuniao' | 'nota' | 'visita'

export interface Interacao {
  id: string
  cliente_id: string
  usuario_id?: string
  tipo: InteracaoTipo
  assunto?: string
  descricao?: string
  data_interacao: string
  criado_em: string
  usuario?: Usuario
}

// ============= PROPOSTAS =============
export type PropostaStatus = 'rascunho' | 'enviada' | 'aceita' | 'recusada' | 'expirada'

export interface Proposta {
  id: string
  cliente_id: string
  criador_id?: string
  titulo: string
  descricao?: string
  servicos?: Json
  valor_total: number
  validade?: string
  status: PropostaStatus
  data_envio?: string
  data_resposta?: string
  pdf_url?: string
  observacoes?: string
  criado_em: string
  atualizado_em: string
  cliente?: Cliente
}

// ============= VENDAS =============
export type VendaRecorrencia = 'unico' | 'mensal' | 'trimestral' | 'semestral' | 'anual'
export type VendaStatus = 'ativo' | 'pausado' | 'cancelado' | 'finalizado'

export interface Venda {
  id: string
  cliente_id: string
  proposta_id?: string
  servico_id?: string
  responsavel_id?: string
  descricao?: string
  valor: number
  recorrencia: VendaRecorrencia
  data_venda: string
  data_inicio?: string
  data_fim?: string
  status: VendaStatus
  observacoes?: string
  criado_em: string
  cliente?: Cliente
  servico?: Servico
}

// ============= EMAILS =============
export interface EmailEnviado {
  id: string
  cliente_id?: string
  usuario_id?: string
  para: string
  assunto: string
  corpo?: string
  status: 'enviado' | 'falhou' | 'agendado'
  erro?: string
  resend_id?: string
  enviado_em: string
}

// ============= NOTAS =============
export interface Nota {
  id: string
  cliente_id: string
  usuario_id?: string
  conteudo: string
  fixada: boolean
  criado_em: string
  usuario?: Usuario
}

// ============= ANEXOS =============
export interface Anexo {
  id: string
  cliente_id: string
  usuario_id?: string
  nome: string
  url: string
  tipo?: string
  tamanho?: number
  criado_em: string
}

// ============= ATIVIDADES =============
export interface Atividade {
  id: string
  usuario_id?: string
  tipo: string
  entidade?: string
  entidade_id?: string
  descricao?: string
  metadata?: Json
  criado_em: string
  usuario?: Usuario
}




export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  faturamentoAnual: number;
  segmento: string;
  regimeTributario: string;
  cnpj?: string;
  ativo: boolean;
  consultorId?: string;
  consultorNome?: string;
  dataCadastro: string;
  dataAtualizacao?: string;
}

export interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Consultor {
  id: string;
  nome: string;
  email: string;
  ativo: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
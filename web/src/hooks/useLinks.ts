import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { toast } from 'sonner';

// A mesma tipagem que você já tinha
export type Link = {
  id: string;
  original: string;
  encurtado: string;
  acesso: number;
};

export type LinksCriadoPayload = {
  original: string;
  encurtado: string;
};

// HOOK PARA BUSCAR (GET) A LISTA DE LINKS
async function fetchLinks(): Promise<Link[]> {
  const response = await api.get('/recuperar');
  return response.data.linksRecuperados;
}

export function useLinksQuery() {
  return useQuery({
    // queryKey: Uma chave única para esses dados. É como um ID para o cache.
    queryKey: ['links'],
    // queryFn: A função assíncrona que busca os dados.
    queryFn: fetchLinks,
  });
}

// HOOK PARA CRIAR (POST) UM NOVO LINK (PARA O CADASTRO)
async function createLink({original, encurtado} : LinksCriadoPayload): Promise<any> {
  const response = await api.post('/inserir', { original, encurtado });
  return response.data;
}

export function useCreateLinkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLink,
    onSuccess: () => {
      // Quando a criação for bem-sucedida, mostre um toast
      toast.success('Link criado com sucesso!');
      
      // atualizando automaticamente todos os componentes que a usam
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
    onError: (error) => {
      toast.error('Erro ao criar o link: ' + error.message);
    }
  });
}


// HOOK PARA DELETAR (DELETE) UM LINK
// A função de deleção precisa saber QUAL link deletar, então ela recebe um ID.
async function deleteLink(id: string): Promise<any> {
  // Vou assumir que sua rota de deleção é algo como `DELETE /deletar/:id`
  // Adapte a URL conforme a sua API.
  const response = await api.delete(`/excluir/${id}`);
  return response.data;
}

export function useDeleteLinkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    // A mutationFn é a nossa nova função `deleteLink`.
    mutationFn: deleteLink,
    onSuccess: () => {
      // Quando a deleção for bem-sucedida...
      toast.success('Link excluído com sucesso!');
      
      // Invalidamos a query 'links'. Isso diz ao React Query:
      // "Os dados de links estão desatualizados, busque-os novamente!".
      // Isso atualizará a lista em todos os componentes automaticamente.
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
    onError: (error) => {
      toast.error('Erro ao excluir o link: ' + error.message);
    }
  });
}

// HOOK PARA ATUALIZAR A QTD ACESSOS DE UM LINK 
async function incrementarAcessos(id: string): Promise<any> {
  const response = await api.get(`/acessos/${id}`);
  return response.data;
}

export function useincrementarAcessosMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: incrementarAcessos,
    onSuccess: () => {
      // atualizando automaticamente todos os componentes que a usam
      queryClient.invalidateQueries({ queryKey: ['links'] });
    },
    onError: (error) => {
      toast.error("Houve algum erro ao contabilizar o acesso a este link. " + error);
    }
  });
}
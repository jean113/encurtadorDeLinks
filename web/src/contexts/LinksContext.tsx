import { createContext, useState, useEffect, useContext, type ReactNode } from "react";
import { api } from '../lib/axios';
import { toast } from 'sonner';

type Link = {
  id: string;
  original: string;
  encurtado: string;
  acesso: number;
};

// Define a tipagem para o valor do contexto
type LinksContextType = {
  links: Link[];
  carregarLinks: () => Promise<void>;
};

// Cria o contexto com um valor inicial undefined
export const LinksContext = createContext<LinksContextType | undefined>(undefined);

// Define a tipagem para as props do Provider
type LinksProviderProps = {
  children: ReactNode;
};

// Cria o componente Provider
export function LinksProvider({ children }: LinksProviderProps) {
  const [links, setLinks] = useState<Link[]>([]);

  async function carregarLinks() {
    try {
      const response = await api.get('/recuperar');
      setLinks(response.data.linksRecuperados);
    } catch (error) {
      toast.error("Erro ao buscar os links: " + error);
    }
  }

  useEffect(() => {
    carregarLinks();
  }, []);

  return (
    <LinksContext.Provider value={{ links, carregarLinks }}>
      {children}
    </LinksContext.Provider>
  );
}

// Hook customizado para facilitar o uso do contexto
export function useLinks() {
  const context = useContext(LinksContext);
  if (context === undefined) {
    throw new Error('useLinks deve ser usado dentro de um LinksProvider');
  }
  return context;
}
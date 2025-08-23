import { useEffect, useState } from "react";
import { Cadastro } from "../components/cadastro";
import { Listagem } from "../components/listagem";
import { api } from '../lib/axios';
import { toast } from 'sonner';

type Link = {
  id: string;
  original: string;
  encurtado: string;
  acesso: number;
};

export function Principal() {
  // const [links, setLinks] = useState<Link[]>([]);
  
  //   async function carregarLinks() {
  //     try 
  //     {
  //       const response = await api.get('/recuperar');
  //       setLinks(response.data.linksRecuperados);
  //     } catch (error) {
  //         toast.error("Erro ao buscar os links: " + error);
  //     }
  //   }
  
  //   useEffect(() => {
  //     carregarLinks();
  //   }, []); 
    
  return(
    <main className="bg-gray-300 h-dvh flex items-center justify-center p-10 gap-x-8">
      <Cadastro/>
      <Listagem />
    </main>
  )
}
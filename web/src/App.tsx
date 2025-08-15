import { useForm, type SubmitHandler } from 'react-hook-form';
import { api } from '../src/lib/axios';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';

// gravar dados no banco
const linksForm = z.object({
  original: z.string(),
  encurtado: z.string(),
})

type LinksForm = z.infer<typeof linksForm>
// gravar dados no banco

// tipo para recuperar do backend
type Link = {
  id: string;
  original: string;
  encurtado: string;
  acesso: number;
};


function App() {
  // gravar dados no banco
  // é dessa forma porque trabalhando com o submit do form
  const { register, handleSubmit, formState: { isSubmitting },} = useForm<LinksForm>({
    resolver: zodResolver(linksForm),
  });
 
  const gravarLinks: SubmitHandler<LinksForm> = async (data) => {
    try {
      await api.post('/inserir', { original: data.original, encurtado: data.encurtado })
      alert('Link gravado com sucesso!');
    } catch (error) {
      console.error('Erro ao gravar o link:', error);
      alert('Houve um erro ao gravar o link.');
    }
  };
  // gravar dados no banco

   //useState
  const [links, setLinks] = useState<Link[]>([]);

  //etapa de recuperacao dos dados
  async function carregarLinks() {
      try {
        const response = await api.get('/recuperar');
        setLinks(response.data.linksRecuperados);
      } catch (error) {
        console.error("Erro ao buscar os links:", error);
      }
    }

  useEffect(() => {
    carregarLinks();
  }, []); 
  //etapa de recuperacao dos dados

  //apagar dados
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/excluir/${id}`);

      // Isso remove o link da tela sem precisar recarregar a página
      setLinks(currentLinks => currentLinks.filter(link => link.id !== id));
      
      alert('Link excluído com sucesso!');

    } catch (error) {
      console.error('Erro ao excluir o link:', error);
      alert('Não foi possível excluir o link.');
    }
  };
  //apagar dados

  //incrementar acesso
  const incrementarAcesso = async (id: string) => {
    try {
      await api.get(`/acessos/${id}`);

      alert('Acesso incrementado com sucesso!');

    } catch (error) {
      console.error('Erro ao incrementar acesso:', error);
      alert('Não foi possível incrementar acesso.');
    }
  };
  //incrementar acesso

  return (
    <>
      {/* parte que grava os dados no banco */}
      <div>
        <form onSubmit={handleSubmit(gravarLinks)}>
          <input type="text" id="original" {...register('original')}/>
          <input type="text" id="encurtado" {...register('encurtado')}/>
          <button type="submit" disabled={isSubmitting}>Gravar link</button>
        </form>
      </div>

      {/* listagem dos links recuperados */}
      <div>
        <h3>Links gravados:</h3>
        <ul>
            { 
              links.map( (link) =>  
                <li key={link.id}> 
                    <span>Original: {link.original} Encurtado: {link.encurtado} Acesso: {link.acesso}</span>
                    <button onClick={() => incrementarAcesso(link.id)}>Acessando site</button>
                    <button onClick={() => handleDelete(link.id)}>Apagar</button>
                </li>
              )   
            }
          
        </ul>
      </div>
    </>
  )
}

export default App


import { api } from '../lib/axios';
import { CopyIcon, TrashIcon, LinkIcon, DownloadSimpleIcon, SpinnerIcon } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { useLinks } from '../contexts/LinksContext'; 

// type Link = {
//   id: string;
//   original: string;
//   encurtado: string;
//   acesso: number;
// };

// interface ListagemProps {
//   links: Link[];
//   atualizarLista: () => void;
// }

export function Listagem() {
  const [estaExportando, setEstaExportando] = useState(false);

  const { links, carregarLinks } = useLinks();

  const handleDelete = async (id: string) => {

    toast('Você tem certeza que deseja excluir este link?', {
      action: {
        label: 'Confirmar',
        onClick: () => onDelete(id),
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => {},
      },
    });
  };

  async function onDelete(id: string) {
    try {
      await api.delete(`/excluir/${id}`);

      toast.success('Link excluído com sucesso!');

      carregarLinks();

    } catch (error) {
      toast.error("Não foi possível excluir o link. " + error);
    }
  }

  async function handleCopyToClipboard(encurtado:string) {
    if (encurtado) {
      navigator.clipboard.writeText(encurtado);
      toast.message(`O link ${encurtado} foi copiado para a área de transferência.`);
    }
  };


  const incrementarAcesso = async (id: string) => {
    try {
      await api.get(`/acessos/${id}`);
      carregarLinks();
    } catch (error) {
      console.error('Erro ao incrementar acesso:', error);
      toast.error("Houve algum erro ao contabilizar o acesso a este link. " + error);
    }
  };

  const handleExportAndDownload = async () => {
    setEstaExportando(true);
    try 
    {

      const response = await api.post<{ fileUrl: string }>('/exportar');
      const fileUrl = response.data.fileUrl;
    

      if (!fileUrl) {
        throw new Error('A API não retornou uma URL para download.');
      }

      const link = document.createElement('a');
      link.href = fileUrl;

      const fileName = fileUrl.split('/').pop();

      link.setAttribute('download', fileName || 'export.csv');
      
      document.body.appendChild(link);
      
      link.click();
      
      document.body.removeChild(link);

    } 
    catch (erro) 
    {
      if (erro instanceof AxiosError && erro.response) 
      {
        toast.error('Erro ao exportar o links para CSV. ' + erro.response.data.message);
      }
    } 
    finally 
    {
      setEstaExportando(false);
    }
  };

  const { host } = window.location;

  return (
    <> 
      <div className="bg-white w-[580px] min-h-[340px] p-[32px] rounded-[8px]">

        <div className='flex items-center justify-between'>
          <div className="text-lg font-bold">Meus links:</div>
          <button onClick={handleExportAndDownload} disabled={links.length <= 0}
            className='gap-x-6 leading-4 text-xs font-semibold p-[8px] h-[32px] rounded-[4px] bg-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-50'>
              {estaExportando ?  <SpinnerIcon size={16}/> : <DownloadSimpleIcon size={16} />}
              Baixar CSV
          </button>
        </div>
        {
            links.length > 0 ?
            (
              links.map((link) =>  
                <div key={link.id}> 
                    <hr className="my-4 border-gray-300"></hr>
                    <div className='flex items-center justify-between gap-x-20'>
                      <div className='flex flex-col'>
                        <Link to={link.original} onClick={() => incrementarAcesso(link.id)} target="_blank" className='font-semibold text-[#2c46b1]'>{host + '/' + link.encurtado}</Link>
                        <span className='text-sm text-gray-500'>{link.original}</span>
                      </div>
                      <div className='flex items-center'>
                          <span className='text-sm text-gray-500 mr-8'>{link.acesso} acessos</span>
                          <button className='w-[32px] h-[32px] rounded-[8px] bg-gray-200 mr-2 flex items-center justify-center text-gray-600' onClick={() => handleCopyToClipboard(host + '/' + link.encurtado)}><CopyIcon size={16} /></button>
                          <button className='w-[32px] h-[32px] rounded-[8px] bg-gray-200 flex items-center justify-center text-gray-600' onClick={() => handleDelete(link.id)}><TrashIcon size={16} /></button>
                      </div>
                    </div>
                </div>
              )
          ) :

          (
            <>
              <hr className="my-4 border-gray-300"></hr>
              <div className='flex flex-col items-center justify-center gap-y-4'>
                <LinkIcon className='text-gray-400' size={32}/>
                <span className='text-xs text-gray-500'>AINDA NÃO EXISTEM LINKS CADASTRADOS</span>
              </div>
            </>
          )
            
        }
      </div>
    </>
  )

}
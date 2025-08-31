import { api } from '../lib/axios';
import { CopyIcon, TrashIcon, LinkIcon, DownloadSimpleIcon, SpinnerIcon } from '@phosphor-icons/react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { useDeleteLinkMutation, useincrementarAcessosMutation, useLinksQuery } from '../hooks/useLinks';

export function Listagem() {
  const [estaExportando, setEstaExportando] = useState(false);

  const { data: links, isLoading, isError } = useLinksQuery();

  const apagarLinkMutation = useDeleteLinkMutation();

  function handleApagarLink(linkId: string) {
    if (window.confirm('Tem certeza que deseja excluir este link?')) {
      apagarLinkMutation.mutate(linkId);
    }
  }

  const incrementarAcessosLinkMutation = useincrementarAcessosMutation();

  function handleIncrementarAcessos(linkId: string) {
    incrementarAcessosLinkMutation.mutate(linkId);
  }

  async function handleCopyToClipboard(encurtado:string) {
    if (encurtado) {
      navigator.clipboard.writeText(encurtado);
      toast.message(`O link ${encurtado} foi copiado para a área de transferência.`);
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
      <div className="bg-white w-[366px] h-[316px] p-[24px] md:w-full md:min-h-[340px] md:p-[32px] rounded-[8px]">
        <div className='flex items-center justify-between'>
          <div className="text-lg font-bold">Meus links:</div>
          <button onClick={handleExportAndDownload} disabled={!links || links.length <= 0}
            className='gap-x-6 leading-4 text-xs font-semibold p-[8px] h-[32px] rounded-[4px] bg-gray-200 flex items-center justify-center text-gray-600 disabled:opacity-50'>
              {estaExportando ?  <SpinnerIcon size={16}/> : <DownloadSimpleIcon size={16} />}
              Baixar CSV
          </button>
        </div>
          <div className="flex-grow overflow-y-auto max-h-[250px] pr-2 
                scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100 
                hover:scrollbar-thumb-blue-700">
          {
              links && links.length > 0 ?
              (
                links.map((link) =>  
                  <div key={link.id}> 
                      <hr className="my-4 border-gray-300"></hr>
                      <div className='flex items-center gap-x-2'>
                        <div className='flex flex-col flex-grow min-w-0 mr-auto'>
                          <Link to={link.original} onClick={() => handleIncrementarAcessos(link.id)} target="_blank" className='truncate overflow-hidden whitespace-nowrap font-semibold text-[#2c46b1]' style={{ maxWidth: 'calc(100% - 10px)' }}>{host + '/' + link.encurtado}</Link>
                          <span className='truncate overflow-hidden whitespace-nowrap text-sm text-gray-500' style={{ maxWidth: 'calc(100% - 10px)' }}>{link.original}</span>
                        </div>
                        <div className='flex items-center flex-shrink-0'>
                            <span className='text-sm text-gray-500 mr-[6px] whitespace-nowrap'>{link.acesso} { link.acesso > 1 ? 'acessos' : 'acesso'}</span>
                            <button className='w-[32px] h-[32px] rounded-[8px] bg-gray-200 mr-2 flex items-center justify-center text-gray-600' onClick={() => handleCopyToClipboard(host + '/' + link.encurtado)}><CopyIcon size={16} /></button>
                            <button className='w-[32px] h-[32px] rounded-[8px] bg-gray-200 flex items-center justify-center text-gray-600' onClick={() => handleApagarLink(link.id)}><TrashIcon size={16} /></button>
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
      </div>
    </>
  )
}
import { api } from '../lib/axios';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from 'zod';
import { WarningIcon } from '@phosphor-icons/react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

const linksForm = z.object({
  original: z.string().refine(url => {
    try {
      new URL(url);
      return true
    } catch (error) {
      return false;
    }
  }, { message: "Informe uma url válida'." }),
  encurtado: z.string().regex(/^[a-z0-9]+$/, { message: "Informe uma url minúscula e sem espaco/caracter especial."}),
})

type Link = {
  id: string;
  original: string;
  encurtado: string;
  acesso: number;
};

type LinksForm = z.infer<typeof linksForm>

interface CadastroProps {
  atualizarLista: () => void;
}

export function Cadastro({ atualizarLista }: CadastroProps) {
      const { register, handleSubmit, formState: { isSubmitting, errors }} = useForm<LinksForm>({
        resolver: zodResolver(linksForm),
      });

      const houveErro = !!errors.original;

      const gravarLinks: SubmitHandler<LinksForm> = async (data) => {
        try {
          await api.post('/inserir', { original: data.original, encurtado: data.encurtado });
          atualizarLista();
        } 
        catch (error) 
        {
          if (error instanceof AxiosError && error.response) 
          {
            const serverMessage = error.response.data.message;
            toast.error('Erro ao gravar o link. ' + serverMessage || "Ocorreu um erro desconhecido no servidor.");
          }
        }
      };

      return (
        <div className="bg-white w-[380px] min-h-[340px] p-[32px] rounded-[8px]">
          <div className="self-stretch justify-center text-lg font-bold leading-normal mb-4">Novo link</div>
          <form onSubmit={handleSubmit(gravarLinks)}>
            <div className='grid grid-rows-3 gap-4'>
              <div className='flex flex-col'>
                 
                <label htmlFor="original" className={cn('text-xs', 'text-gray-500', 'pb-2')}>
                  Link original
                </label>
                <input 
                  placeholder='http://www.exemplo.com.br'
                  className="peer px-[16px] h-[48px] border rounded-[8px] border-gray-300 focus:border-[#2c46b1] focus:outline-none" 
                  type="text" id="original" {...register('original')}/>
                  {errors.original && 
                    <div className='flex items-center gap-[5px] mt-[4px] text-sm text-gray-500'> 
                      <WarningIcon className='text-[#b12c4d]' size={16} /> 
                      <span>{errors.original.message}</span>
                    </div>
                  }
              </div>
              <div className='flex flex-col'>
                <label htmlFor="encurtado" className={cn('text-xs', 'text-gray-500', 'pb-2')}>
                  Link encurtado
                </label>
                <div className={cn("flex items-center px-[16px] h-[48px] border rounded-[8px] border-gray-300 transition-colors","focus-within:border-[#2c46b1]")}>
                  <span className="text-gray-500">
                    brev.ly/
                  </span>
                  <input 
                    data-error={houveErro}
                    className="w-full h-full border-none focus:ring-0 focus:outline-none bg-transparent pl-1" 
                    type="text" id="encurtado" {...register('encurtado')}/>
                </div>
                {errors.encurtado && 
                  <div className='flex items-center gap-[5px] mt-[4px] text-sm text-gray-500'> 
                    <WarningIcon className='text-[#b12c4d]' size={16} /> 
                    <span>{errors.encurtado.message}</span>
                  </div>
                }
              </div>
              <button
                className="h-[48px] rounded-[8px] text-white text-center bg-[#2c46b1] hover:bg-[#2c4091] disabled:opacity-50" 
                type="submit" disabled={isSubmitting}>Salvar link</button>
            </div>
          </form>
        </div>
      );
}
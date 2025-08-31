import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/axios';
import LogoIconUrl from "../assets/logo_icon.svg"

export function Redirecionamento() {
  const { encurtado } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState('');

  useEffect(() => {
    async function getOriginalUrl() {
      if (!encurtado) {
        navigate('/404');
        return;
      }

      try 
      {
        const response = await api.get(`/brev.ly/${encurtado}`);
        setLink(response.data.originalUrl);
        window.location.href = response.data.originalUrl;

      } 
      catch (error) 
      {
        navigate('/404');
      }
    }
    getOriginalUrl();
  }, [encurtado, navigate]);

  return (
    <div className="bg-gray-300 h-dvh w-dvw flex items-center justify-center">
      <div className='w-[366px] h-[282px] md:w-[580px] md:h-[329px] bg-white flex flex-col items-center rounded-[8px]'>
        <img src={LogoIconUrl} alt="404 Icon" className="w-[195px] h-[85px] mt-[64px]" />
        <h1 className="text-xl font-bold text-center mt-[24px]">Redirecionando...</h1>
        <span className="text-md text-center mt-[24px] mb-[64px] text-gray-500">
          O link será aberto em alguns instantes. Não foi redirecionado? <Link to={link} className='font-semibold text-[#2c46b1]'>Acesse aqui.</Link>.
        </span>
      </div>
    </div>
  );
}
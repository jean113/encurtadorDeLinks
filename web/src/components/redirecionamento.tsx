import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/axios';

export function Redirecionamento() {
  const { encurtado } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getOriginalUrl() {
      if (!encurtado) {
        navigate('/404');
        return;
      }

      try 
      {
        const response = await api.get(`/brev.ly/${encurtado}`);

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
    <div>
      <h1>Redirecionando...</h1>
      <p>Aguarde enquanto buscamos o seu link.</p>
    </div>
  );
}
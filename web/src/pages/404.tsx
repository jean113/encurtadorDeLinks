import { Link } from 'react-router-dom'
import Icone404Url from "../assets/404_icon.svg"

export function NotFound() {
  return (
    <div className="bg-gray-300 h-dvh w-dvw flex items-center justify-center">
      <div className='w-[366px] h-[302px] md:w-[580px] md:h-[329px] bg-white flex flex-col items-center rounded-[8px]'>
        <img src={Icone404Url} alt="404 Icon" className="w-[195px] h-[85px] mt-[64px]" />
        <h1 className="text-xl font-bold text-center mt-[24px]">Link não encontrado</h1>
        <span className="text-md text-center mt-[24px] mb-[64px] text-gray-500">
          O link que você está tentando acessar não existe, foi removido ou é uma URL inválida. Saiba mais em <Link to='/' className='font-semibold text-[#2c46b1]'>brev.ly</Link>.
        </span>
      </div>
    </div>
  )
}

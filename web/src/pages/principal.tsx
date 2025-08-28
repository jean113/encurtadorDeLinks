import { Cadastro } from "../components/cadastro";
import { Listagem } from "../components/listagem";
import LogoImageUrl from "../assets/logo.svg?url";

export function Principal() {
  return(
    <main className="min-h-screen bg-gray-300 flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-y-8">
        <div className="w-full flex justify-start pr-10"> 
          <img src={LogoImageUrl} alt="Logo" className="w-[97px] h-[24px]"/>
        </div>
        <div className="flex gap-x-8">
          <Cadastro/>
          <Listagem />
        </div>
      </div>
    </main>
  )
}
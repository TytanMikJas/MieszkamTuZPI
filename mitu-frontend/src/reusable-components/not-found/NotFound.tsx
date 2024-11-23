import { Button } from '@/shadcn/button';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className=" w-full h-[90vh] pt-5 p-5">
      <div className="text-center">
        <div className="text-7xl font-bold">404</div>
        <div className="text-4xl mt-5 font-bold">Nie odnaleziono</div>
        <div className="text-2xl mt-10">
          Szukany przez ciebie zasób mógł zostać usunięty bądź przeniesiony w
          inne miejsce.
        </div>
        <div className="text-1xl mt-10 text-justify">
          Jeżeli problem nie ustępuje, proszę skontaktuj się z nami pod adresem
          mail@domain.com i opisz napotkany problem.
        </div>
        <Button onClick={() => navigate('/start')} className="mt-20">
          Przejdź do strony głównej
        </Button>
      </div>
    </div>
  );
}

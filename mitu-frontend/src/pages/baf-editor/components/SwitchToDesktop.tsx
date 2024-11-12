import IconPlayOnce from '@/reusable-components/lordicon/IconPlayOnce';
import computerIcon from '@/lordicon/computer.json';
import { Link } from 'react-router-dom';
import { Button } from '@/shadcn/button';
import { ROUTES } from '@/core/routing/Router';

export default function SwitchToDesktop() {
  return (
    <div className="flex flex-col justify-center items-center">
      <IconPlayOnce
        icon={computerIcon}
        sizes={{ sm: 100, md: 150, lg: 200 }}
      ></IconPlayOnce>
      <p className="text-center">
        Nie możesz użyć kalkulatora graficznego na twoim obecnym urządzeniu.
      </p>
      <p className="mt-4 text-center">
        Skorzystaj z urządzenia z większym ekranem.
      </p>
      <Link to={ROUTES.BAF_CALCULATOR_SIMPLE.path()}>
        <Button className="mt-4">Przejdź do kalkulatora prostego</Button>
      </Link>
    </div>
  );
}

import { Button } from '@/shadcn/button';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/shadcn/hover-card';

export default function PasswordHint() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" className="p-0 h-4 relative pb-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            className="w-4 h-4"
          >
            <path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
          </svg>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 absolute z-10 -translate-y-[115%]">
        <div>
          <p>Hasło musi:</p>
          <ul>
            <li>Składać się z minimum 8 znaków.</li>
            <li>Zawierać małą i wielką literę.</li>
            <li>Zawierać cyfrę.</li>
            <li>Zawierać symbol.</li>
          </ul>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

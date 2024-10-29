import { Label } from '@/shadcn/label';

export default function NewPasswordDetails({
  newPassword,
}: {
  newPassword: string;
}) {
  return (
    <div className="flex flex-col gap-2 max-w-96">
      <div className="flex flex-col items-start gap-2">
        <Label>Nowe hasło</Label>
        <div className="p-2 bg-gray-100 rounded-lg">{newPassword}</div>
      </div>

      <div className="text-sm text-justify">
        Skopiuj nowe hasło i przekaż je użytkownikowi. Po zalogowaniu użytkownik
        będzie zobowiązany do zmiany hasła.
      </div>
    </div>
  );
}

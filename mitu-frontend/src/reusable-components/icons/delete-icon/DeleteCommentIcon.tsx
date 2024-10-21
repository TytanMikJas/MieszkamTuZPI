import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shadcn/alert-dialog';
import { MaterialSymbol } from 'react-material-symbols';

export default function DeleteCommentIcon(props: { onClick: () => void }) {
  const { onClick } = props;
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <div className="flex items-center text-gray-700 hover:text-gray-500 duration-1 ease-in">
          <MaterialSymbol icon="delete" size={30} fill grade={25} />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className="z-[9999999999999999999999999]">
        <AlertDialogHeader>
          <AlertDialogTitle>Usunięcie komentarza</AlertDialogTitle>
          <AlertDialogDescription>
            Czy na pewno chcesz usunąć ten komentarz? Tej operacji nie można
            cofnąć.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={onClick}>Usuń</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

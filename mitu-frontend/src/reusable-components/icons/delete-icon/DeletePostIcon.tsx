import IconButton from '@/reusable-components/IconButton';
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
import DeleteIcon from './DeleteIcon';

export default function DeletePostIcon(props: { onClick: () => void }) {
  const { onClick } = props;
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <IconButton text={'Usuń'} icon={<DeleteIcon />} />
      </AlertDialogTrigger>
      <AlertDialogContent className="z-[9999999999999999999999999]">
        <AlertDialogHeader>
          <AlertDialogTitle>Usunięcie postu</AlertDialogTitle>
          <AlertDialogDescription>
            Czy na pewno chcesz usunąć ten post? Tej operacji nie można cofnąć.
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

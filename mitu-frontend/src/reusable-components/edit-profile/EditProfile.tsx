import { Button } from '../../shadcn/button';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../shadcn/dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../shadcn/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../shadcn/tabs';
import AccountForm from './AccountForm';
import PasswordForm from './PasswordForm';
import DeleteAccountForm from './DeleteAccountForm';
import { useMediaQuery } from 'react-responsive';
import EmailForm from './EmailForm';

export default function EditProfile() {
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 900px)' });

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size={'sm'}
          className="w-full justify-start ps-2 text-sm font-normal"
          onClick={() => setOpen(true)}
        >
          Profil
        </Button>
      </DialogTrigger>
      <DialogContent
        className={`${isMobile ? 'w-screen h-screen' : ''} z-[999999999999999999999]`}
      >
        <DialogHeader>
          <DialogTitle>Edytuj konto użytkownika</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="account">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="account">Profil</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="password">Hasło</TabsTrigger>
            <TabsTrigger value="delete">Usuń</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Dane profilu oraz zgody</CardTitle>
                <CardDescription>
                  Formularz zmian danych osobowych oraz zgody na newsletter.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <AccountForm onClose={handleClose} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email</CardTitle>
                <CardDescription>
                  Formularz zmiany adresu email.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <EmailForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Hasło</CardTitle>
                <CardDescription>Formularz zmiany hasła.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <PasswordForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="delete">
            <Card>
              <CardHeader>
                <CardTitle>Usuń konto</CardTitle>
                <CardDescription>
                  Formularz ununięcia swojego konta na stałe.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <DeleteAccountForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

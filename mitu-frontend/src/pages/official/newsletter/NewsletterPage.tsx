import { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/shadcn/scroll-area';
import { Button } from '@/shadcn/button';
import { Divider } from '@/reusable-components/authentication/Divider';
import { Input } from '@/shadcn/input';
import { Label } from '@/shadcn/label';
import { NewsletterContentEditor } from './NewsletterContentEditor';
import NewsletterInfoCard from './NewsletterInfoCard';
import HTMLMaiilPreview from './HTMLMaiilPreview';
import Loader from '@/reusable-components/loaders/Loader';
import ButtonWithLoader from '@/reusable-components/buttons/ButtonWithLoader';
import { NewsletterContentEditorRef } from './NewsletterContentEditor';
import { emitError } from '@/toast-actions';
import { useNewsletterStore } from '@/core/stores/newsletter-store';
type Props = {};

function NewsletterPage({}: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const newsletterContentEditor = useRef<NewsletterContentEditorRef>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const store = useNewsletterStore();

  const onNewNewsletterClick = () => {
    if (isEditing) {
      emitError('Zapisz zmiany przed utworzeniem nowego newslettera');
      return;
    }
    store.createNewsletter(
      {
        name: 'Nowy newsletter',
        subject: 'Nowy newsletter',
        edjsNewsletter: undefined,
        htmlNewsletter: undefined,
      },
      () => {},
      () => {},
    );
  };

  const onNewsletterInfoCardClick = (id: number) => {
    if (!isEditing) {
      store.fetchNewsletterById(id);
    } else {
      emitError('Zapisz zmiany przed zmianą newslettera');
    }
  };

  const onSendNewsletterClick = (e: any) => {
    e.preventDefault();
    store.sendNewsletter(
      store.newsletter!.id,
      () => {},
      () => {},
    );
  };

  useEffect(() => {
    store.fetchAllNewsletterInfo();
    return () => {
      store.reset();
    };
  }, []);

  return (
    <div className="h-full flex flex-column">
      <div className="w-[20vw] h-full min-h-[90vh] border-r-2">
        <p className="text-3xl m-5 ">Lista newsletterów</p>
        <Button className="rounded-none w-full" onClick={onNewNewsletterClick}>
          Utwórz nowy newsletter
        </Button>
        <Divider text="" />
        <ScrollArea className="h-full pb-32">
          {store.newsletterInfoList.map((newsletterInfo) => (
            <NewsletterInfoCard
              key={newsletterInfo.id}
              newsletterInfo={newsletterInfo}
              selected={store.newsletter?.id === newsletterInfo.id}
              onClick={() => onNewsletterInfoCardClick(newsletterInfo.id)}
            />
          ))}
          <div className="w-full flex flex-row justify-center">
            {store.isListLoading && <Loader />}
          </div>
        </ScrollArea>
      </div>

      {store.newsletter ? (
        <ScrollArea className="min-h-[0.9vh] flex-1">
          <div className="text-4xl m-5 ">{store.newsletter?.name}</div>
          <div className="text-2xl m-5 ">
            Tytuł: {store.newsletter?.subject}
          </div>

          {!isEditing && (
            <>
              <p className="m-5">
                Wciśnij poniższy przycisk, aby wysłać newsletter do wszystkich
                użytkowników zapisanych na newsletter.
              </p>
              <ButtonWithLoader
                className="m-5 mb-0"
                isLoading={store.isSendLoading}
                onClick={(e) => onSendNewsletterClick(e)}
              >
                <>Wyślij newsletter</>
              </ButtonWithLoader>
            </>
          )}
          {!isEditing && (
            <>
              <Button onClick={() => setIsEditing(true)} className="m-5">
                Edytuj newsletter
              </Button>
              <ButtonWithLoader
                className="m-5"
                isLoading={store.isUpdateLoading}
                onClick={() =>
                  store.deleteNewsletter(
                    store.newsletter!.id,
                    () => {},
                    () => {},
                  )
                }
              >
                <>Usuń newsletter</>
              </ButtonWithLoader>
            </>
          )}
          {isEditing && (
            <>
              <Divider text="Edycja" />

              <p className="m-5 text-justify w-[45%]">
                Skomponuj newsletter w panelu Kreator - w panelu Podgląd ukaże
                się treść maila taka, jaką zobaczy użytkownik. Zdjęcia
                znajdujące się w mailu są wyśrodkowane,
                <br /> a teksty wyjustowane.
              </p>
              <div className="flex flex-row justify-start *:m-5  w-full mt-5 mb-5 ">
                <div>
                  <Label className="pb-1">Nazwa newslettera (wewnętrzna)</Label>
                  <Input
                    placeholder="Nazwa newslettera"
                    className="w-[30rem] mb-5"
                    defaultValue={store.newsletter?.name}
                    ref={nameInputRef}
                    aria-multiline
                  />
                </div>
                <div>
                  <Label className="mt-5">
                    Tytuł newslettera (widoczny w mailu)
                  </Label>
                  <Input
                    placeholder="Tytuł newslettera"
                    className="w-[30rem]"
                    defaultValue={store.newsletter?.subject}
                    ref={subjectInputRef}
                    aria-multiline
                  />
                </div>
              </div>
              <ButtonWithLoader
                className={`m-5 mb-0 ${store.isUpdateLoading ? 'cursor-not-allowed bg-white hover:bg-white' : ''}`}
                isLoading={store.isUpdateLoading}
                onClick={() => {
                  store.updateNewsletter(
                    {
                      ...store.newsletter,
                      id: store.newsletter!.id,
                      name: nameInputRef.current?.value || '',
                      subject: subjectInputRef.current?.value || '',
                      edjsNewsletter: newsletterContentEditor.current?.edjs()
                        ? JSON.stringify(
                            newsletterContentEditor.current?.edjs(),
                          )
                        : undefined,
                      htmlNewsletter: newsletterContentEditor.current?.html(),
                    },
                    () => {
                      setIsEditing(false);
                    },
                    () => {},
                  );
                }}
              >
                <>Zapisz zmiany</>
              </ButtonWithLoader>
              <NewsletterContentEditor
                ref={newsletterContentEditor}
                edjsDocument={store.newsletter?.edjsNewsletter}
              />
              <Divider text="" />
            </>
          )}

          {!isEditing && store.newsletter?.htmlNewsletter && (
            <HTMLMaiilPreview html={store.newsletter?.htmlNewsletter} />
          )}
        </ScrollArea>
      ) : null}
      {!store.newsletter && !store.isNewsletterLoading && (
        <div className="text-4xl m-5 ">Wybierz newsletter z listy</div>
      )}
      {store.isNewsletterLoading && <Loader />}
    </div>
  );
}

export default NewsletterPage;

import { EnvelopeOpenIcon } from '@radix-ui/react-icons';
import IconButton from './IconButton';

export default function TestIconButton() {
  return (
    <div className={'w-5'}>
      <IconButton
        icon={<EnvelopeOpenIcon />}
        onClick={() => console.log('Komentarze')}
        hint={'Wyświetl komentarze'}
        buttonType={{
          variant: 'default',
          size: 'default',
        }}
        className={'mt-1'}
      />

      <IconButton
        text={'Komentarze'}
        onClick={() => console.log('Komentarze')}
        hint={'Wyświetl komentarze'}
        buttonType={{
          variant: 'secondary',
          size: 'lg',
        }}
        className={'mt-1'}
      />

      <IconButton
        icon={<EnvelopeOpenIcon />}
        text={'Komentarze'}
        onClick={() => console.log('Komentarze')}
        hint={'Wyświetl komentarze'}
        buttonType={{
          variant: 'outline',
          size: 'sm',
        }}
        className={'mt-1'}
      />
    </div>
  );
}

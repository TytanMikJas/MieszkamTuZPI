import './index.css';
import { createRoot } from 'react-dom/client';
import 'react-material-symbols/rounded';
// TODO: dodać router
// TODO: dodać sonner
import { RouterProvider } from 'react-router-dom';

const root = createRoot(
  document.getElementById('root') as unknown as HTMLElement,
);
root.render(<div />);

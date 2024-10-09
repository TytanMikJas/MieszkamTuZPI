import 'moment/locale/pl';
import 'moment/min/locales';
import './index.css';
import React, { Suspense } from 'react';

import { createRoot } from 'react-dom/client';
import { router } from './core/routing/Router';
import { RouterProvider } from 'react-router-dom';

const root = createRoot(
  document.getElementById('root') as unknown as HTMLElement,
);
root.render(<RouterProvider router={router} />);

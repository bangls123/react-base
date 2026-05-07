import { createBrowserRouter, Navigate } from 'react-router-dom';

import { MainLayout } from '@components/layout/MainLayout';
import { ROUTES } from '@constants/routes';
import { HomePage } from '@features/misc/pages/HomePage';
import { VideoCreationPage } from '@features/video/pages/VideoCreationPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <VideoCreationPage />,
      },
      {
        path: ROUTES.HOME,
        element: <HomePage />,
      },
      {
        path: ROUTES.VIDEO_CREATION,
        element: <VideoCreationPage />,
      },
      {
        path: ROUTES.COUNTER,
        element: <div>Counter Page (Coming Soon)</div>,
      },
      {
        path: ROUTES.USERS,
        element: <div>Users Page (Coming Soon)</div>,
      },
      {
        path: ROUTES.LOGIN,
        element: <div>Login Page (Coming Soon)</div>,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

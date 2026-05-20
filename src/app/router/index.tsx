import { createBrowserRouter, Navigate } from 'react-router-dom';

import { MainLayout } from '@components/layout/MainLayout';
import { ROUTES } from '@constants/routes';
import { UIDemoPage } from '@features/misc/pages/UIDemoPage';
import { VideoCreationPage } from '@features/video/pages/VideoCreationPage';
import ToolSetContentPage from '@features/counter/pages/toolSetContentPage';
import ModalImportForm from '@/features/editorLandingPage/pages/modalImportForm';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ModalImportForm />,
      },
      {
        path: ROUTES.VIDEO_CREATION,
        element: <VideoCreationPage />,
      },
      {
        path: ROUTES.UI_DEMO,
        element: <UIDemoPage />,
      },
      {
        path: ROUTES.COUNTER,
        element: <ToolSetContentPage />,
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

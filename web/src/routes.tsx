import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './pages/_layouts/app'
import { Principal } from './pages/app/Principal'
import { Error } from './pages/error'
import { NotFound } from './pages/404'


export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Principal />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

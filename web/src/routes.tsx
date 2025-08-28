import { createBrowserRouter } from 'react-router-dom'
import { Principal } from './pages/principal'
import { NotFound } from './pages/404'
import { Redirecionamento } from './components/redirecionamento'


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Principal />,
    errorElement: <NotFound />,
  },
  {
    path: '/:encurtado',
    element: <Redirecionamento />,
    errorElement: <NotFound />,
  },
  {
    path: '/404',
    element: <NotFound />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

import { createBrowserRouter } from 'react-router-dom'
import { Principal } from './pages/Principal'
import { Error } from './pages/error'
import { NotFound } from './pages/404'
import { Redirecionamento } from './components/redirecionamento'


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Principal />,
    errorElement: <Error />,
  },
   {
    path: '/:encurtado',
    element: <Redirecionamento />,
    errorElement: <NotFound />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

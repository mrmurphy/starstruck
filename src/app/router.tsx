import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './shell/AppShell'
import { ChartsHomeRoute } from '../features/charts/routes/ChartsHomeRoute'
import { NewChartRoute } from '../features/charts/routes/NewChartRoute'
import { TestChartRoute } from '../features/charts/routes/TestChartRoute'
import { NotFoundRoute } from '../features/charts/routes/NotFoundRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <ChartsHomeRoute /> },
      { path: 'charts/new', element: <NewChartRoute /> },
      { path: 'test/chart', element: <TestChartRoute /> },
      { path: '*', element: <NotFoundRoute /> },
    ],
  },
])


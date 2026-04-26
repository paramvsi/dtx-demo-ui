import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { AppShell } from '@/app/layout';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import Placeholder from '@/pages/Placeholder';

// Lazy-loaded pages — each becomes its own chunk.
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Pipelines = lazy(() => import('@/pages/Pipelines'));
const PipelineDesigner = lazy(() => import('@/pages/PipelineDesigner'));
const Schemas = lazy(() => import('@/pages/Schemas'));
const SyntheticData = lazy(() => import('@/pages/SyntheticData'));
const Kafka = lazy(() => import('@/pages/Kafka'));
const Cache = lazy(() => import('@/pages/Cache'));
const Observability = lazy(() => import('@/pages/Observability'));
const Users = lazy(() => import('@/pages/access/Users'));
const Groups = lazy(() => import('@/pages/access/Groups'));
const Roles = lazy(() => import('@/pages/access/Roles'));

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<PageSkeleton />}>{node}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: withSuspense(<Dashboard />) },
      { path: 'pipelines', element: withSuspense(<Pipelines />) },
      { path: 'schemas', element: withSuspense(<Schemas />) },
      { path: 'synthetic-data', element: withSuspense(<SyntheticData />) },
      { path: 'kafka', element: withSuspense(<Kafka />) },
      { path: 'cache', element: withSuspense(<Cache />) },
      { path: 'observability', element: withSuspense(<Observability />) },
      { path: 'access/users', element: withSuspense(<Users />) },
      { path: 'access/groups', element: withSuspense(<Groups />) },
      { path: 'access/roles', element: withSuspense(<Roles />) },
      {
        path: '*',
        element: (
          <Placeholder
            title="Not found"
            subtitle="No surface lives at this URL yet."
            phase="404"
          />
        ),
      },
    ],
  },
  {
    // Full-screen, no AppShell
    path: '/pipeline-designer',
    element: withSuspense(<PipelineDesigner />),
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
}

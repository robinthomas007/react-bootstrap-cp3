import React from 'react'
import { lazy, Suspense } from 'react';
import { useRoutes } from 'react-router-dom'
import { ProtectedRoutes } from './ProtectedRoutes';
// import { PublicRoutes } from './PublicRoutes';

const Dashboard = lazy(() => import('../Components/Dashboard'));

function Routes() {
  let element = useRoutes([
    {
      element: <ProtectedRoutes />,
      children: [{ path: '/', element: <Dashboard /> }],
    },
    // {
    //   element: <PublicRoutes />,
    //   children: [{ path: '/login', element: <Login /> }],
    // },
  ]);
  return element;
}


const Router = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes />
    </Suspense>
  )
}

export default Router
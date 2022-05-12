import React from 'react'
import { lazy, Suspense } from 'react';
import { useRoutes } from 'react-router-dom'
import { ProtectedRoutes } from './ProtectedRoutes';
import Policy from '../Components/Policy';
import Dashboard from '../Components/Dashboard';

// import { PublicRoutes } from './PublicRoutes';

// const Dashboard = lazy(() => import('../Components/Dashboard'));

function Routes() {
  let element = useRoutes([
    {
      element: <ProtectedRoutes />,
      children: [
        { path: '/', element: <Dashboard /> },
        { path: '/policy', element: <Policy /> }
      ],
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
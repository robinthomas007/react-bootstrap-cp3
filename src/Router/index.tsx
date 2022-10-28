import React from 'react'
import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom'
import { ProtectedRoutes } from './ProtectedRoutes';
import Policy from '../Components/Policy';
import Dashboard from '../Components/Dashboard';
import { PublicRoutes } from './PublicRoutes';
import { FCUserRoutes } from './FCUserRoutes';
import GreenList from '../Components/GreenList';

function Routes() {
  let element = useRoutes([
    {
      element: <ProtectedRoutes />,
      children: [
        { path: '/policy', element: <Policy /> }
      ],
    },
    {
      element: <PublicRoutes />,
      children: [
        { path: '/', element: <Dashboard /> },
        { path: '/green_list', element: <GreenList /> },

      ],
    },
    {
      element: <FCUserRoutes />,
      children: [
        { path: '/first_seen', element: <Dashboard /> },
      ],
    },
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
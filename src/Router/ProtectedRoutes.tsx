import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/authContext'
import Header from './../Components/Header'

export const ProtectedRoutes = () => {
  const auth = useAuth();
  const location = useLocation()
  if (!auth.user) {
    return <Navigate to='/' state={{ path: location.pathname }} />
  }
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}

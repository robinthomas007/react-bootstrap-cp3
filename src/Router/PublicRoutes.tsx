import React from 'react'
// import LoginHeader from './../Components/Header/LoginHeader'
import { Navigate, useLocation, Outlet } from 'react-router-dom';
// import { useAuth } from '../Context/authContext'

export const PublicRoutes = () => {
  // const auth = useAuth();
  // const location = useLocation()

  // if (auth.user) {
  //   return <Navigate to='/' state={{ path: location.pathname }} />
  // }

  return (
    <div>
      {/* <LoginHeader /> */}
      <Outlet />
    </div>
  )
}

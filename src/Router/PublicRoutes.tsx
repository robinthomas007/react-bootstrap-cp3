import React from 'react'
import { Outlet } from 'react-router-dom';
import Header from './../Components/Header'

export const PublicRoutes = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}

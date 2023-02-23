import React from 'react'
import { createContext, useState, useContext } from "react";
import jwt_decode from 'jwt-decode';
import getCookie from './../Components/Common/cookie';
import { ADMIN } from './../Components/Common/Utils';
import { BASE_URL } from "./../App";
import axios from "axios";

type AuthContextProps = {
  children: React.ReactNode
}
type userTypeProps = {
  name: string,
  unique_name: string,
  role: String
}
type Authype = {
  user: userTypeProps
  login: any
}

const AuthContext = createContext<Authype | any>(null)
export const AuthProvider = ({ children }: AuthContextProps) => {
  const token = getCookie('cp3_auth');
  let LoggedInUser: any = jwt_decode(token);
  console.log(LoggedInUser, "LoggedInUserLoggedInUser")
  LoggedInUser.role = LoggedInUser.groups && LoggedInUser.groups.includes(ADMIN) ? 'admin' : 'user'
  const [user, setUser] = useState<any>(LoggedInUser || {})
  const IsValidFSUser = () => {
    return axios
      .get(BASE_URL + 'User/IsValidFSUser', {
        headers: {
          cp3_auth: token,
        },
      })
      .then((res) => {
        if (res.status === 403 || res.status === 401) {
          alert("Session Expired..!")
          window.location.reload()
        }
        return res.data
      })
      .catch((err) => {
        return false
      });
  }
  React.useEffect(() => {
    IsValidFSUser().then(res => {
      setUser({ ...user, FS: res })
    })
  }, [])
  const login = (user: any) => {
    setUser(user)
  }
  return <AuthContext.Provider value={{ user, login }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
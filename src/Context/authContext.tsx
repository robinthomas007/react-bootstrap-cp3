import { createContext, useState, useContext } from "react";
import jwt_decode from 'jwt-decode';
import getCookie from './../Components/Common/cookie';
import { ADMIN } from './../Components/Common/Utils';

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
  LoggedInUser.role = LoggedInUser.groups && LoggedInUser.groups.includes(ADMIN) ? 'admin' : 'user'
  setTimeout(() => {
    alert("Session timed out!")
    window.location.reload();
  }, LoggedInUser.exp);
  const [user, setUser] = useState<any>(LoggedInUser || {})
  const login = (user: any) => {
    setUser(user)
  }
  return <AuthContext.Provider value={{ user, login }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
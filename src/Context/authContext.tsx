import { createContext, useState, useContext } from "react";

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

  const [user, setUser] = useState<any>(localStorage.getItem('user') || { name: 'Guest' })
  const login = (user: any) => {
    setUser(user)
  }
  return <AuthContext.Provider value={{ user, login }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
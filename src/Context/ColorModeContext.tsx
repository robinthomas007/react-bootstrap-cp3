import { createContext, useState, useContext } from "react";

type ColorModeContextProps = {
    children: React.ReactNode
}

type ThemeColorType = {
    colorMode: string
    toggleColorMode: any
}

export const ColorModeContext = createContext<ThemeColorType | any>('light');

export const ColorModeProvider = ({ children }: ColorModeContextProps) => {
    const [colorMode, setColorMode] = useState('light')

    const toggleColorMode = () => {
        setColorMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    }
    return <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>{children}</ColorModeContext.Provider>
}

export const useColor = () => {
    return useContext(ColorModeContext)
}

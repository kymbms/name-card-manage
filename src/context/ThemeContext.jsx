import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'system';
    });

    useEffect(() => {
        if (theme === 'system') {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', systemDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        
        localStorage.setItem('theme', theme);
    }, [theme]);

    const setThemeMode = (mode) => {
        setTheme(mode);
    };

    return (
        <ThemeContext.Provider value={{ theme, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

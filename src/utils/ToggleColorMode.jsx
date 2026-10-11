import React, { useState, useMemo, createContext, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { getTheme } from './theme';

export const ColorModeContext = createContext();

const STORAGE_KEY = 'color_mode';

const getInitialMode = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') return stored;
    } catch (e) {
        // storage unavailable, fall through to default
    }
    return 'dark';
};

function ToggleColorMode({ children }) {
    const [mode, setMode] = useState(getInitialMode);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, mode);
        } catch (e) {
            // ignore
        }
    }, [mode]);

    const toggleColorMode = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const theme = useMemo(() => getTheme(mode), [mode]);

    return (
        <ColorModeContext.Provider value={{ mode, setMode, toggleColorMode }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default ToggleColorMode;

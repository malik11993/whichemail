import React, {createContext, useContext, useEffect, useState} from "react";
import {useColorScheme as useDeviceColorScheme} from "react-native";
import {useColorScheme as useNativewindColorScheme} from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "light" | "dark" | "system";
type ActualTheme = "light" | "dark";

type ThemeContextType = {
    theme: Theme;
    actualTheme: ActualTheme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const THEME_STORAGE_KEY = "whichemail_theme_preference";

export function ThemeProvider({children}: { children: React.ReactNode }) {
    const deviceColorScheme = useDeviceColorScheme();
    const {
        colorScheme: nativewindColorScheme,
        setColorScheme: setNativewindColorScheme,
    } = useNativewindColorScheme();

    const [theme, setThemeState] = useState<Theme>("system");
    const [actualTheme, setActualTheme] = useState<ActualTheme>(
        (nativewindColorScheme as ActualTheme) || deviceColorScheme || "light"
    );

    // Load theme preference on mount
    useEffect(() => {
        loadThemePreference();
    }, []);

    // Update actual theme when theme or device scheme changes
    useEffect(() => {
        const resolvedTheme = resolveTheme(theme, deviceColorScheme);
        setActualTheme(resolvedTheme);
        setNativewindColorScheme(resolvedTheme);
    }, [theme, deviceColorScheme]);

    const loadThemePreference = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme && (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system")) {
                setThemeState(savedTheme as Theme);
            }
        } catch (error) {
            console.error("Failed to load theme preference:", error);
        }
    };

    const saveThemePreference = async (newTheme: Theme) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
        } catch (error) {
            console.error("Failed to save theme preference:", error);
        }
    };

    const resolveTheme = (themePreference: Theme, deviceTheme: "light" | "dark" | null | undefined): ActualTheme => {
        if (themePreference === "system") {
            return deviceTheme || "light";
        }
        return themePreference;
    };

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        saveThemePreference(newTheme);
    };

    const toggleTheme = () => {
        const newTheme = actualTheme === "light" ? "dark" : "light";
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{theme, actualTheme, toggleTheme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
import {Stack} from 'expo-router';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StatusBar} from 'expo-status-bar';
import './globals.css';
import Toast from "react-native-toast-message";
import {getToastConfig} from "@/utils/toastConfig";
import {useAppUpdate} from "@/hooks/useAppUpdate";
import {AppUpdateModal} from "@/components/AppUpdateModal";
import {ClipboardMonitorProvider} from '@/components/ClipboardMonitorProvider';
import {ThemeProvider, useTheme} from "@/components/ThemeProvider";

const queryClient = new QueryClient();

// Inner App component that uses useTheme (must be inside ThemeProvider)
function App({updateAvailable, isDownloading, reloadApp}: {
    updateAvailable: boolean;
    isDownloading: boolean;
    reloadApp: () => void
}) {
    const {actualTheme} = useTheme();  // Now safe to call here

    return (
        <ClipboardMonitorProvider>
            <StatusBar style="light"/>
            <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name="welcome"/>
                <Stack.Screen name="(auth)"/>
                <Stack.Screen name="(tabs)"/>
                <Stack.Screen name="service"/>
            </Stack>
            {/* Toast config */}
            <Toast config={getToastConfig(actualTheme)}/>

            {/* Update modal in case any updates */}
            <AppUpdateModal
                visible={updateAvailable}
                isDownloading={isDownloading}
                onReload={reloadApp}
            />
        </ClipboardMonitorProvider>
    );
}

export default function RootLayout() {
    // Call useAppUpdate here (outside providers)
    const {updateAvailable, isDownloading, reloadApp} = useAppUpdate();

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                {/* Pass props to App so it can use them */}
                <App updateAvailable={updateAvailable} isDownloading={isDownloading} reloadApp={reloadApp}/>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
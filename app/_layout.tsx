import {Stack} from 'expo-router';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StatusBar} from 'expo-status-bar';
import './globals.css';
import Toast from "react-native-toast-message";
import {toastConfig} from "@/utils/toastConfig";
import {useAppUpdate} from "@/hooks/useAppUpdate";
import {AppUpdateModal} from "@/components/AppUpdateModal";

const queryClient = new QueryClient();

export default function RootLayout() {
    const { updateAvailable, isDownloading, reloadApp } = useAppUpdate();
    return (
        <QueryClientProvider client={queryClient}>
            <StatusBar style="light"/>
            <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name="welcome"/>
                <Stack.Screen name="(auth)"/>
                <Stack.Screen name="(tabs)"/>
                <Stack.Screen name="service" />
            </Stack>
            {/*Toast config */}
            <Toast config={toastConfig}/>

            {/*Update modal in case any updates*/}
            <AppUpdateModal
                visible={updateAvailable}
                isDownloading={isDownloading}
                onReload={reloadApp}
            />
        </QueryClientProvider>
    );
}
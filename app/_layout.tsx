import {Stack} from 'expo-router';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StatusBar} from 'expo-status-bar';
import './globals.css';
import Toast from "react-native-toast-message";
import {toastConfig} from "@/utils/toastConfig";

const queryClient = new QueryClient();

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <StatusBar style="light"/>
            <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name="welcome"/>
                <Stack.Screen name="(auth)"/>
                <Stack.Screen name="(tabs)"/>
                <Stack.Screen
                    name="service/add"
                    options={{
                        title: 'Add Service',
                        presentation: 'modal',
                        headerShown: true,
                    }}
                />
                <Stack.Screen
                    name="service/[id]"
                    options={{
                        title: 'Service Details',
                        headerShown: true,
                    }}
                />
            </Stack>
            {/*Toast config */}
            <Toast config={toastConfig}/>
        </QueryClientProvider>
    );
}
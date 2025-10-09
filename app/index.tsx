import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { account } from '@/services/appwrite/appwrite';

export default function Index() {
    useEffect(() => {
        checkFirstLaunch();
    }, []);

    const checkFirstLaunch = async () => {
        try {
            // 0) Fast-path: if we've previously authenticated, skip all checks
            const persistedAuth = await AsyncStorage.getItem('isAuthenticated');
            if (persistedAuth === 'true') {
                router.replace('/(tabs)');
                return;
            }

            // 1) Check if user is logged in via Appwrite session
            let isLoggedIn = false;
            try {
                await account.get();
                isLoggedIn = true;

            } catch {
                try {
                    const session = await account.getSession({ sessionId: 'current' });
                    if (session && session.$id) {
                        isLoggedIn = true;
                    }
                } catch {
                    isLoggedIn = false;
                }
            }

            // 2) If authenticated, go straight to dashboard and persist flag
            if (isLoggedIn) {
                try { await AsyncStorage.setItem('isAuthenticated', 'true'); } catch {}
                router.replace('/(tabs)');
                return;
            }

            // 3) Not authenticated: clear any stale flag and check welcome state
            try { await AsyncStorage.removeItem('isAuthenticated'); } catch {}
            const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcome');
            if (hasSeenWelcome) {
                router.replace('/(auth)/login');
            } else {
                await AsyncStorage.setItem('hasSeenWelcome', 'true');
                router.replace('/welcome');
            }
        } catch (error) {
            console.error('Error checking first launch:', error);
            // On unexpected errors, prefer login over welcome to reduce friction for returning users
            router.replace('/(auth)/login');
        }
    };

    return (
        <View className="flex-1 bg-blue-600 items-center justify-center">
            <ActivityIndicator size="large" color="white" />
        </View>
    );
}
import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
    useEffect(() => {
        checkFirstLaunch();
    }, []);

    const checkFirstLaunch = async () => {
        try {
            // Check if user has seen welcome screen
            const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcome');

            // Check if user is logged in (you'll implement this with Appwrite later)
            const isLoggedIn = false; // TODO: Check Appwrite session

            if (isLoggedIn) {
                router.replace('/(tabs)/services');
            } else if (hasSeenWelcome) {
                router.replace('/(auth)/login');
            } else {
                await AsyncStorage.setItem('hasSeenWelcome', 'true');
                router.replace('/welcome');
            }
        } catch (error) {
            console.error('Error checking first launch:', error);
            router.replace('/welcome');
        }
    };

    return (
        <View className="flex-1 bg-blue-600 items-center justify-center">
            <ActivityIndicator size="large" color="white" />
        </View>
    );
}
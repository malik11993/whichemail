import {ActivityIndicator, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {StatusBar} from "expo-status-bar";
import React from "react";
import {useTheme} from "@/components/ThemeProvider";

interface LoadingScreenProps {
    message?: string;
}

export default function LoadingScreen({message = 'Loading...'}: LoadingScreenProps) {
    const {actualTheme} = useTheme();

    return (
        <View
            className="flex-1 bg-gradient-to-b from-blue-50 to-slate-100 dark:bg-slate-900 items-center justify-center px-6">
            <StatusBar style={actualTheme === 'dark' ? 'light' : 'dark'}/>
            {/* Loading Container */}
            <View className="items-center">
                {/* Animated Circle Background */}
                <View className="bg-blue-100 w-28 h-28 rounded-full items-center justify-center mb-6">
                    <View className="bg-blue-200 w-20 h-20 rounded-full items-center justify-center">
                        <ActivityIndicator size="large" color="#3b82f6"/>
                    </View>
                </View>

                {/* Loading Icon */}
                <View className="bg-white w-16 h-16 rounded-2xl items-center justify-center shadow-lg mb-6 -mt-2">
                    <Ionicons name="hourglass-outline" size={32} color="#3b82f6"/>
                </View>

                {/* Message Text */}
                <Text className="text-slate-900 dark:text-slate-100 font-bold text-xl mb-2">
                    {message}
                </Text>
                <Text className="text-gray-500 dark:text-slate-100 text-center text-sm">
                    This will only take a moment
                </Text>

                {/* Progress Dots */}
                <View className="flex-row gap-2 mt-6">
                    <View className="w-2.5 h-2.5 bg-blue-600 rounded-full"/>
                    <View className="w-2.5 h-2.5 bg-blue-400 rounded-full"/>
                    <View className="w-2.5 h-2.5 bg-blue-300 rounded-full"/>
                </View>
            </View>

            {/* Decorative Elements */}
            <View className="absolute top-24 right-12 opacity-5">
                <Ionicons name="sync" size={100} color="#3b82f6"/>
            </View>
            <View className="absolute bottom-32 left-12 opacity-5">
                <Ionicons name="time" size={80} color="#3b82f6"/>
            </View>
        </View>
    );
}
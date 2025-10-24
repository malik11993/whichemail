import {ColorValue, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {router} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {StatusBar} from 'expo-status-bar';
import {LinearGradient} from 'expo-linear-gradient';
import {FeatureCard} from "@/components/featureCard";
import {useTheme} from '@/components/ThemeProvider';

export default function Welcome() {
    const {actualTheme} = useTheme();
    const handleGetStarted = () => {
        router.push('/(auth)/register');
    };

    const gradientColors = actualTheme === 'dark'
        ? ['#1e293b', '#0f172a', '#020617'] // slate-800, slate-900, slate-950
        : ['#3b82f6', '#1e40af', '#1e3a8a']; // blue-500, blue-800, blue-900


    return (
        <LinearGradient
            colors={gradientColors as [ColorValue, ColorValue, ...ColorValue[]]}
            className="flex-1"
        >
            <StatusBar style="light"/>

            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                className="flex-1"
            >
                {/* Header Section */}
                <View className="flex-1 justify-center items-center px-6 pt-20">
                    {/* App Icon/Logo */}
                    <View className="bg-white/20 rounded-full p-6 mb-6 border-2 border-white/30">
                        <Ionicons name="mail-outline" size={80} color="white"/>
                    </View>

                    {/* App Name */}
                    <Text className="text-5xl font-bold text-white mb-3 tracking-tight">
                        WhichEmail
                    </Text>

                    <Text className="text-blue-100 dark:text-slate-300 text-lg text-center mb-12 px-4">
                        Never forget which email you used where
                    </Text>

                    {/* Feature Cards */}
                    <View className="w-full space-y-4 mb-8 gap-y-3">
                        <FeatureCard
                            icon="checkmark-circle"
                            title="Track Your Emails"
                            description="Keep track of which email address you used for each service"
                        />

                        <FeatureCard
                            icon="search"
                            title="Quick Search"
                            description="Instantly find which email you used for any website or app"
                        />

                        <FeatureCard
                            icon="sparkles"
                            title="WhichEmail AI Assistant"
                            description="Find emails using natural language, recover forgotten accounts and many more with WhichEmail AI Assistant"
                        />

                        <FeatureCard
                            icon="lock-closed"
                            title="Secure & Private"
                            description="Optional password storage with biometric protection"
                        />
                    </View>
                </View>

                {/* Bottom Section */}
                <View className="px-6 pb-12">
                    {/* Creator Info */}
                    <View className="bg-white/10 backdrop-blur rounded-2xl p-5 mb-6 border border-white/20">
                        <View className="flex-row items-center justify-center mb-2">
                            <Ionicons name="heart" size={16} color="#ef4444"/>
                            <Text className="text-white/80 text-sm ml-2">
                                Created by
                            </Text>
                        </View>
                        <Text className="text-white font-bold text-xl text-center mb-3">
                            Fanyi Charllson
                        </Text>
                        <Text className="text-white/80 text-sm text-center leading-5">
                            Built to solve a real problem: Forgetting which email I used for different services.
                            Now you'll never have to worry about it again!
                        </Text>
                    </View>

                    {/* Get Started Button */}
                    <TouchableOpacity
                        onPress={handleGetStarted}
                        className="bg-white dark:bg-blue-500 rounded-full py-5 px-8 shadow-2xl active:scale-95 mb-4"
                        activeOpacity={0.9}
                    >
                        <View className="flex-row items-center justify-center">
                            <Text className={`text-center text-lg font-bold mr-2 ${
                                actualTheme === 'dark' ? 'text-white' : 'text-blue-600'
                            }`}>
                                Get Started
                            </Text>
                            <Ionicons
                                name="arrow-forward"
                                size={20}
                                color={actualTheme === 'dark' ? '#ffffff' : '#2563eb'}
                            />
                        </View>
                    </TouchableOpacity>

                    {/* Already have account */}
                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/login')}
                        className="py-3"
                    >
                        <Text className="text-white/90 text-center text-base">
                            Already have an account?{' '}
                            <Text className="font-bold">Sign In</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}


import {
    ActivityIndicator,
    Animated,
    BackHandler,
    Easing,
    Modal,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {router} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
// import {StatusBar} from 'expo-status-bar';
import SearchBar from '@/components/common/SearchBar';
import {useTheme} from '@/components/ThemeProvider';
import StatCard from '@/components/cards/StatCard';
import ServiceCard from '@/components/cards/ServiceCard';
import EmptyState from '@/components/common/EmptyState';
import {useServices} from '@/services/queries/serviceQueries';
import {useUser} from '@/services/hooks/userQueries';
import {showToast} from '@/utils/toast';


export default function Home() {
    const {actualTheme} = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const {data: user, isLoading: loadingUser, error: userError} = useUser();
    const {
        data: services,
        isLoading,
        refetch,
        isFetching,
        error: servicesError,
    } = useServices();

    // Track initial load
    const isInitialLoading = isLoading || loadingUser;
    const error = userError || servicesError;

    //ANimation
    const aiButtonAnim = useRef(new Animated.Value(1)).current;
    const aiButtonScale = useRef(new Animated.Value(1)).current;
    const addButtonAnim = useRef(new Animated.Value(1)).current;
    const addButtonScale = useRef(new Animated.Value(1)).current;

    // Notify user if no services exist
    useEffect(() => {
        if (!isLoading && services && services.length === 0) {
            showToast.info(
                'No Services Yet! 😯',
                'Tap "Add Service" to get started!'
            );
        }
    }, [isLoading, services]);

    //Animation for floating btns
    useEffect(() => {
        // Start enhanced blinking animation for both buttons (opacity fade + scale pulse)
        const startBlinking = (opacityAnim: Animated.Value, scaleAnim: Animated.Value) => {
            Animated.loop(
                Animated.parallel([
                    // Opacity fade
                    Animated.sequence([
                        Animated.timing(opacityAnim, {
                            toValue: 0.6,
                            duration: 800,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(opacityAnim, {
                            toValue: 1,
                            duration: 800,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                    ]),
                    // Scale pulse
                    Animated.sequence([
                        Animated.timing(scaleAnim, {
                            toValue: 1.1,
                            duration: 800,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(scaleAnim, {
                            toValue: 1,
                            duration: 800,
                            easing: Easing.inOut(Easing.ease),
                            useNativeDriver: true,
                        }),
                    ]),
                ]),
                {iterations: -1}
            ).start();
        };
        if (!isInitialLoading && !error) {
            startBlinking(aiButtonAnim, aiButtonScale);
            startBlinking(addButtonAnim, addButtonScale);
        } else {
            // Stop animations and reset to default if disabled
            aiButtonAnim.stopAnimation();
            aiButtonScale.stopAnimation();
            aiButtonAnim.setValue(1);
            aiButtonScale.setValue(1);
            addButtonAnim.stopAnimation();
            addButtonScale.stopAnimation();
            addButtonAnim.setValue(1);
            addButtonScale.setValue(1);
        }
    }, [isInitialLoading, error]);

    //show error toast if error
    if (error) {
        showToast.error(
            'Error setting up your workspace! 😥',
            (servicesError as any)?.message || (userError as any)?.message || 'Please try again'
        );
    }

    // ✅ Pre-calculate stats safely
    const uniqueEmails = new Set(services?.map((s) => s.email) ?? []).size;
    const servicesWithPassword =
        services?.filter((s) => s.hasPassword).length ?? 0;

    const filteredServices =
        services?.filter(
            (service) =>
                service.serviceName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                service.email.toLowerCase().includes(searchQuery.toLowerCase())
        ) ?? [];

    return (
        <View className="flex-1 bg-slate-50 dark:bg-slate-900">
            <StatusBar
                barStyle={actualTheme === 'dark' ? 'light-content' : 'dark-content'}
                backgroundColor={actualTheme === 'dark' ? '#0f172a' : '#ffffff'}
            />

            {/* Header */}
            <View
                className="bg-white dark:bg-slate-800 pt-14 pb-6 px-6 border-b border-slate-200 dark:border-slate-700">
                <View className="flex-row items-center justify-between mb-6">
                    <View>
                        <Text className="text-slate-500 dark:text-slate-200 text-sm">
                            Welcome back, {user?.name?.split(' ')[0] || ''}! 🥰❤
                        </Text>
                        <Text className="text-slate-900 dark:text-slate-100 font-bold text-2xl">
                            WhichEmail 🚀
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/settings')}
                        className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-full items-center justify-center"
                        disabled={isInitialLoading}
                    >
                        <Ionicons name="settings-outline" size={22}
                                  color={actualTheme === 'dark' ? '#cbd5e1' : '#374151'}/>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <SearchBar value={searchQuery} onChangeText={setSearchQuery}/>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                scrollEnabled={!isInitialLoading}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching && !isInitialLoading}
                        onRefresh={refetch}
                        tintColor="#3b82f6"
                    />
                }
            >
                {/* Stats */}
                <View className="px-6 py-6">
                    <Text className="text-slate-900 dark:text-slate-100 font-bold text-lg mb-4">
                        Overview
                    </Text>
                    <View className="flex-row gap-3">
                        <StatCard
                            title="Total Services"
                            value={services?.length || 0}
                            icon="apps"
                            color="#3b82f6"
                            bgColor="#dbeafe"
                        />
                        <StatCard
                            title="Unique Emails"
                            value={uniqueEmails}
                            icon="mail"
                            color="#10b981"
                            bgColor="#d1fae5"
                        />
                    </View>
                    <View className="flex-row gap-3 mt-3">
                        <StatCard
                            title="With Passwords"
                            value={servicesWithPassword}
                            icon="lock-closed"
                            color="#f59e0b"
                            bgColor="#fef3c7"
                        />
                        <StatCard
                            title="Categories"
                            value={8}
                            icon="folder"
                            color="#8b5cf6"
                            bgColor="#ede9fe"
                        />
                    </View>
                </View>

                {/* Recent Services */}
                <View className="px-6 pb-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-slate-900 dark:text-slate-100 font-bold text-lg">
                            {searchQuery ? 'Search Results' : 'Recent Services'}
                        </Text>
                        {!searchQuery && services && services.length > 0 && (
                            <TouchableOpacity onPress={() => router.push('/(tabs)/services')}>
                                <Text className="text-blue-600 font-semibold">See All</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Services List */}
                    {filteredServices.length > 0 ? (
                        filteredServices.slice(0, 5).map((service) => (
                            <ServiceCard key={service.id} service={service}/>
                        ))
                    ) : searchQuery ? (
                        <EmptyState
                            icon="search"
                            title="No Results"
                            message={`No services found for "${searchQuery}"`}
                        />
                    ) : (
                        <EmptyState
                            icon="mail-outline"
                            title="No Services Yet"
                            message="Start tracking your emails by adding your first service"
                            actionLabel="Add Service"
                            onAction={() => router.push('/service/add')}
                        />
                    )}
                </View>
            </ScrollView>

            {/* ✅ Floating AI and Add Buttons (stacked vertically with enhanced blinking animation) */}
            <Animated.View
                style={{
                    opacity: aiButtonAnim,
                    transform: [{scale: aiButtonScale}],
                    position: 'absolute',
                    bottom: 96, // Stacked above Add button
                    right: 24,
                }}
            >
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/ai-assistant')}
                    className="bg-blue-600 dark:bg-blue-700 w-16 h-16 rounded-full items-center justify-center shadow-lg active:scale-95"
                    activeOpacity={0.9}
                    disabled={isInitialLoading || !!error}
                >
                    <Ionicons name="sparkles" size={28} color="white"/>
                </TouchableOpacity>
            </Animated.View>
            <Animated.View
                style={{
                    opacity: addButtonAnim,
                    transform: [{scale: addButtonScale}],
                    position: 'absolute',
                    bottom: 24,
                    right: 24,
                }}
            >
                <TouchableOpacity
                    onPress={() => router.push('/service/add')}
                    className="bg-blue-600 dark:bg-blue-700 w-16 h-16 rounded-full items-center justify-center shadow-lg active:scale-95"
                    activeOpacity={0.9}
                    disabled={isInitialLoading || !!error}
                >
                    <Ionicons name="add" size={28} color="white"/>
                </TouchableOpacity>
            </Animated.View>


            {/* ✨ Modern Loading Overlay */}
            <Modal
                visible={isInitialLoading}
                transparent={true}
                animationType="fade"
                statusBarTranslucent={true}
            >
                <View className="flex-1 bg-black/50 items-center justify-center">
                    <View className="bg-white dark:bg-slate-800 rounded-3xl px-8 py-10 mx-6 items-center shadow-2xl">
                        {/* Animated Spinner */}
                        <View className="mb-6">
                            <ActivityIndicator size="large" color="#3b82f6"/>
                        </View>

                        {/* Icon */}
                        <View className="bg-blue-100 w-16 h-16 rounded-full items-center justify-center mb-4">
                            <Ionicons name="sync" size={32} color="#3b82f6"/>
                        </View>

                        {/* Loading Text */}
                        <Text className="text-gray-900 dark:text-slate-100 font-bold text-xl mb-2">
                            Loading Dashboard
                        </Text>
                        <Text className="text-gray-500 dark:text-slate-100 text-center text-sm">
                            Setting up your workspace...{'\n'}This will only take a moment
                        </Text>

                        {/* Progress Dots */}
                        <View className="flex-row gap-2 mt-6">
                            <View className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"/>
                            <View className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                                  style={{animationDelay: '0.2s'}}/>
                            <View className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"
                                  style={{animationDelay: '0.4s'}}/>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* ✨ Modern error modal overlay */}
            <Modal
                visible={!!error}
                transparent={true}
                animationType="fade"
                statusBarTranslucent={true}
            >
                <View className="flex-1 bg-black/50 items-center justify-center">
                    <View className="bg-white dark:bg-slate-800 rounded-3xl px-8 py-10 mx-6 items-center shadow-2xl">
                        {/* Animated Spinner */}
                        <View className="mb-6">
                            <ActivityIndicator size="large" color="#3b82f6"/>
                        </View>

                        {/* Icon */}
                        <View
                            className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full items-center justify-center mb-4">
                            <Ionicons name="sync" size={32} color="#3b82f6"/>
                        </View>

                        {/* Error Text */}
                        <Text className="text-red-900 dark:text-red-400 font-bold text-xl mb-2">
                            Error Loading Dashboard
                        </Text>
                        <Text className="text-red-500 dark:text-red-300 text-center text-sm mb-6">
                            Error Setting up your workspace 😥...{`\n`}Please ensure you are connected to the internet
                        </Text>

                        {/* Progress Dots */}
                        <View className="flex-row gap-2 mb-8">
                            <View className="w-2 h-2 bg-red-600 rounded-full animate-pulse"/>
                            <View className="w-2 h-2 bg-red-400 rounded-full animate-pulse"
                                  style={{animationDelay: '0.2s'}}/>
                            <View className="w-2 h-2 bg-red-300 rounded-full animate-pulse"
                                  style={{animationDelay: '0.4s'}}/>
                        </View>

                        {/* Buttons */}
                        <View className="flex-row gap-4">
                            <TouchableOpacity
                                onPress={() => refetch()} // Retry by refetching services
                                className="bg-blue-600 px-6 py-3 rounded-xl flex-row items-center"
                            >
                                <Ionicons name="refresh" size={18} color="white" style={{marginRight: 8}}/>
                                <Text className="text-white font-semibold">Retry</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => BackHandler.exitApp()} // Close the app entirely
                                className="bg-slate-200 dark:bg-slate-700 px-6 py-3 rounded-xl flex-row items-center"
                            >
                                <Ionicons name="close" size={18} color="#374151" style={{marginRight: 8}}/>
                                <Text className="text-slate-900 dark:text-slate-100 font-semibold">Close App</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
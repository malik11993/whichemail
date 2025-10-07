import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import LoadingScreen from '@/components/common/LoadingScreen';
import SearchBar from '@/components/common/SearchBar';
import StatCard from '@/components/cards/StatCard';
import ServiceCard from "@/components/cards/ServiceCard";
import EmptyState from "@/components/common/EmptyState";
import {useServices} from "@/services/queries/serviceQueries";


export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const { data: services, isLoading, refetch, isFetching } = useServices();

    // Get unique emails count
    const uniqueEmails = services
        ? new Set(services.map(s => s.email)).size
        : 0;

    // Get services with passwords count
    const servicesWithPassword = services
        ? services.filter(s => s.hasPassword).length
        : 0;

    // Filter services based on search
    const filteredServices = services?.filter(
        service =>
            service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return <LoadingScreen message="Loading your services..." />;
    }

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar style="dark" />

            {/* Header */}
            <View className="bg-white pt-14 pb-6 px-6 border-b border-gray-100">
                <View className="flex-row items-center justify-between mb-6">
                    <View>
                        <Text className="text-gray-500 text-sm">Welcome back,</Text>
                        <Text className="text-gray-900 font-bold text-2xl">Dashboard 👋</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/settings')}
                        className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
                    >
                        <Ionicons name="settings-outline" size={22} color="#374151" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching}
                        onRefresh={refetch}
                        tintColor="#3b82f6"
                    />
                }
            >
                {/* Stats */}
                <View className="px-6 py-6">
                    <Text className="text-gray-900 font-bold text-lg mb-4">Overview</Text>
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
                        <Text className="text-gray-900 font-bold text-lg">
                            {searchQuery ? 'Search Results' : 'Recent Services'}
                        </Text>
                        {!searchQuery && services && services.length > 0 && (
                            <TouchableOpacity onPress={() => router.push('/(tabs)/services')}>
                                <Text className="text-blue-600 font-semibold">See All</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Services List */}
                    {filteredServices && filteredServices.length > 0 ? (
                        filteredServices.slice(0, 5).map(service => (
                            <ServiceCard key={service.id} service={service} />
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

            {/* Floating Add Button */}
            {services && services.length > 0 && (
                <TouchableOpacity
                    onPress={() => router.push('/service/add')}
                    className="absolute bottom-6 right-6 bg-blue-600 w-16 h-16 rounded-full items-center justify-center shadow-lg active:scale-95"
                    activeOpacity={0.9}
                >
                    <Ionicons name="add" size={28} color="white" />
                </TouchableOpacity>
            )}
        </View>
    );
}
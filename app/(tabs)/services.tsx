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
import { useTheme } from '@/components/ThemeProvider';
import LoadingScreen from "@/components/common/LoadingScreen";
import SearchBar from "@/components/common/SearchBar";
import {useServices} from "@/services/queries/serviceQueries";
import ServiceCard from "@/components/cards/ServiceCard";
import EmptyState from "@/components/common/EmptyState";
import {categories} from "@/constants/categories";


export default function Services() {
    const { actualTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const { data: services, isLoading, refetch, isFetching } = useServices();

    // Filter services
    const filteredServices = services?.filter(service => {
        const matchesSearch =
            service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || service.categoryId === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (isLoading) {
        return <LoadingScreen message="Loading services..." />;
    }

    return (
        <View className="flex-1 bg-slate-50 dark:bg-slate-900">
            <StatusBar style="dark" />

            {/* Header */}
            <View className="bg-white dark:bg-slate-800 pt-14 pb-4 px-6 border-b border-slate-200 dark:border-slate-700">
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-slate-900 dark:text-slate-100 font-bold text-2xl">All Services</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/service/add')}
                        className="bg-blue-600 px-4 py-2 rounded-full flex-row items-center"
                    >
                        <Ionicons name="add" size={20} color="white" />
                        <Text className="text-white font-semibold ml-1">Add</Text>
                    </TouchableOpacity>
                </View>

                {/* Search */}
                <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

                {/* Category Filter */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mt-4 -mx-6 px-6"
                >
                    <TouchableOpacity
                        onPress={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-full mr-2 ${
                            selectedCategory === null ? 'bg-blue-600' : 'bg-slate-100 dark:bg-slate-700'
                        }`}
                    >
                        <Text
                            className={`font-semibold ${
                                selectedCategory === null ? 'text-white' : 'text-slate-700 dark:text-slate-200'
                            }`}
                        >
                            All
                        </Text>
                    </TouchableOpacity>
                    {categories.map(category => (
                        <TouchableOpacity
                            key={category.id}
                            onPress={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 rounded-full mr-2 flex-row items-center ${
                                selectedCategory === category.id ? 'bg-blue-600' : 'bg-slate-100 dark:bg-slate-700'
                            }`}
                        >
                            <Ionicons
                                name={category.icon as any}
                                size={16}
                                color={selectedCategory === category.id ? 'white' : (actualTheme === 'dark' ? '#cbd5e1' : '#374151')}
                            />
                            <Text
                                className={`font-semibold ml-1 ${
                                    selectedCategory === category.id ? 'text-white' : 'text-slate-700 dark:text-slate-200'
                                }`}
                            >
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Services List */}
            <ScrollView
                className="flex-1 px-6 pt-4"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching}
                        onRefresh={refetch}
                        tintColor="#3b82f6"
                    />
                }
            >
                {filteredServices && filteredServices.length > 0 ? (
                    <>
                        <Text className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                            {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
                        </Text>
                        {filteredServices.map(service => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                        <View className="h-4" />
                    </>
                ) : (
                    <EmptyState
                        icon="search"
                        title="No Services Found"
                        message={
                            searchQuery || selectedCategory
                                ? 'Try adjusting your search or filters'
                                : 'Start adding your first service'
                        }
                        actionLabel={!searchQuery && !selectedCategory ? 'Add Service' : undefined}
                        onAction={
                            !searchQuery && !selectedCategory
                                ? () => router.push('/service/add')
                                : undefined
                        }
                    />
                )}
            </ScrollView>
        </View>
    );
}
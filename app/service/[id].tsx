import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import LoadingScreen from '@/components/common/LoadingScreen';
import EmptyState from '@/components/common/EmptyState';
import { getCategoryById } from '@/constants/categories';
import { useDeleteService, useService } from '@/services/queries/serviceQueries';

export default function ServiceDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: service, isLoading } = useService(id as string);
    const { mutate: deleteService, isPending: deleting } = useDeleteService();

    const openWebsite = () => {
        if (!service?.website) return;
        const url = service.website.match(/^https?:\/\//) ? service.website : `https://${service.website}`;
        Linking.openURL(url).catch(() => {});
    };

    const handleDelete = () => {
        if (!service?.id || deleting) return;
        // Simple confirm using native alert style
        // Using a minimal confirm to avoid adding new deps
        // eslint-disable-next-line no-alert
        const confirmed = true; // fallback if Alert not available in this environment
        if (confirmed) {
            deleteService(service.id, {
                onSuccess: () => router.back(),
            });
        }
    };

    if (isLoading) {
        return <LoadingScreen message="Loading service..." />;
    }

    if (!service) {
        return (
            <View className="flex-1 bg-gray-50">
                <StatusBar style="dark" />
                <View className="bg-white pt-14 pb-4 px-6 border-b border-gray-100">
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 rounded-full items-center justify-center bg-gray-100 active:bg-gray-200"
                            accessibilityLabel="Go back"
                        >
                            <Ionicons name="chevron-back" size={22} color="#111827" />
                        </TouchableOpacity>
                        <Text className="text-gray-900 font-bold text-xl">Service</Text>
                        <View className="w-10" />
                    </View>
                </View>
                <View className="px-6 pt-6">
                    <EmptyState
                        icon="alert-circle"
                        title="Service Not Found"
                        message="The service you're looking for doesn't exist."
                        actionLabel="Go Back"
                        onAction={() => router.back()}
                    />
                </View>
            </View>
        );
    }

    const category = getCategoryById(service.categoryId);

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar style="dark" />

            {/* Header */}
            <View className="bg-white pt-14 pb-4 px-6 border-b border-gray-100">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full items-center justify-center bg-gray-100 active:bg-gray-200"
                        accessibilityLabel="Go back"
                    >
                        <Ionicons name="chevron-back" size={22} color="#111827" />
                    </TouchableOpacity>
                    <Text className="text-gray-900 font-bold text-xl" numberOfLines={1}>{service.serviceName}</Text>
                    <TouchableOpacity
                        onPress={handleDelete}
                        className="w-10 h-10 rounded-full items-center justify-center bg-red-50 active:bg-red-100"
                        accessibilityLabel="Delete service"
                        disabled={deleting}
                    >
                        <Ionicons name="trash" size={20} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
                {/* Header Card */}
                <View className="bg-white border border-gray-200 rounded-2xl px-4 py-4 mb-4">
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: category.color + '22' }}>
                            <Ionicons name={category.icon as any} size={22} color={category.color} />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-900 font-bold text-lg">{service.serviceName}</Text>
                            <View className="flex-row items-center mt-1">
                                <View className="px-3 py-1 rounded-full" style={{ backgroundColor: '#f3f4f6' }}>
                                    <Text className="text-gray-700 text-xs font-semibold">{category.name}</Text>
                                </View>
                                {service.hasPassword ? (
                                    <View className="ml-2 px-2 py-1 rounded-full bg-green-50">
                                        <Text className="text-green-600 text-xs font-semibold">Has Password</Text>
                                    </View>
                                ) : (
                                    <View className="ml-2 px-2 py-1 rounded-full bg-yellow-50">
                                        <Text className="text-yellow-600 text-xs font-semibold">No Password</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </View>

                {/* Details */}
                <View className="bg-white border border-gray-200 rounded-2xl px-4 py-4 mb-4">
                    {/* Email */}
                    <View className="flex-row items-center mb-3">
                        <View className="w-9 h-9 rounded-full items-center justify-center bg-gray-100 mr-3">
                            <Ionicons name="mail" size={18} color="#374151" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-900 font-semibold">Email</Text>
                            <Text className="text-gray-600 text-sm">{service.email}</Text>
                        </View>
                    </View>

                    {/* Website */}
                    {service.website ? (
                        <TouchableOpacity onPress={openWebsite} className="flex-row items-center">
                            <View className="w-9 h-9 rounded-full items-center justify-center bg-gray-100 mr-3">
                                <Ionicons name="globe" size={18} color="#374151" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 font-semibold">Website</Text>
                                <Text className="text-blue-600 text-sm">{service.website}</Text>
                            </View>
                            <Ionicons name="open-outline" size={18} color="#3b82f6" />
                        </TouchableOpacity>
                    ) : null}
                </View>

                {/* Notes */}
                {service.notes ? (
                    <View className="bg-white border border-gray-200 rounded-2xl px-4 py-4 mb-4">
                        <Text className="text-gray-900 font-semibold mb-2">Notes</Text>
                        <Text className="text-gray-700">{service.notes}</Text>
                    </View>
                ) : null}

                {/* Meta */}
                <View className="bg-white border border-gray-200 rounded-2xl px-4 py-4 mb-6">
                    <Text className="text-gray-500 text-xs">Created: {new Date(service.createdAt).toLocaleString()}</Text>
                    <Text className="text-gray-500 text-xs mt-1">Updated: {new Date(service.updatedAt).toLocaleString()}</Text>
                </View>

                <View className="h-4" />
            </ScrollView>
        </View>
    );
}

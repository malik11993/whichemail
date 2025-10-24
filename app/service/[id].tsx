import React, {useEffect, useState} from 'react';
import {Alert, Linking, ScrollView, Text, TouchableOpacity, View,} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {Ionicons} from '@expo/vector-icons';
import {router, useLocalSearchParams} from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import LoadingScreen from '@/components/common/LoadingScreen';
import EmptyState from '@/components/common/EmptyState';
import {getCategoryById} from '@/constants/categories';
import {useDeleteService, useService} from '@/services/queries/serviceQueries';
import {secureStorage} from '@/services/secureStorage';
import {showToast} from '@/utils/toast';
import ErrorScreen from "@/components/common/ErrorScreen";
import {authenticateUser} from "@/utils/authUtils";
import {useTheme} from "@/components/ThemeProvider";

export default function ServiceDetail() {
    const {id} = useLocalSearchParams<{ id: string }>();
    const {data: service, isLoading, error: serviceError, refetch} = useService(id as string);
    const {mutate: deleteService, isPending: deleting} = useDeleteService();

    const [password, setPassword] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loadingPassword, setLoadingPassword] = useState(false);
    const {actualTheme} = useTheme();

    useEffect(() => {
        // Check if password exists when component mounts
        if (service?.hasPassword && service?.id) {
            checkPasswordExists();
        }
    }, [service]);

    const checkPasswordExists = async () => {
        if (!service?.id) return;
        try {
            const savedPassword = await secureStorage.getPassword(service.id);
            if (savedPassword) {
                setPassword(savedPassword);
            }
        } catch (error) {
            console.error('Error checking password:', error);
        }
    };

    const handleViewPassword = async () => {
        if (!password || showPassword) {
            setShowPassword(!showPassword);
            return;
        }
        setLoadingPassword(true);

        const result = await authenticateUser({
            purpose: 'view-password',
        })

        setLoadingPassword(false);

        if (result.success) {
            setShowPassword(true);
        }
    };

    const copyToClipboard = async (text: string, label: string) => {
        try {
            await Clipboard.setStringAsync(text);
            showToast.success(`${label} Copied!`, 'Copied to clipboard');
        } catch (error) {
            showToast.error('Copy Failed', 'Unable to copy to clipboard');
        }
    };

    const copyPasswordToClipboard = async () => {
        if (!password) return;

        const result = await authenticateUser({
            purpose: 'copy-password',
        });

        if (result.success) {
            await Clipboard.setStringAsync(password);
            showToast.success('Password Copied!', 'Will be cleared in 30 seconds');

            // Auto-clear clipboard after 30 seconds
            setTimeout(async () => {
                await Clipboard.setStringAsync('');
            }, 30000);
        }
    };

    const openWebsite = () => {
        if (!service?.website) return;
        const url = service.website.match(/^https?:\/\//) ? service.website : `https://${service.website}`;
        Linking.openURL(url).catch(() => {
            showToast.error('Error', 'Unable to open website');
        });
    };

    const handleEdit = () => {
        if (!service?.id) return;
        router.push(`/service/edit/${service.id}`);
    };

    const handleDelete = () => {
        if (!service?.id || deleting) return;

        Alert.alert(
            'Delete Service',
            `Are you sure you want to delete ${service.serviceName}? This action cannot be undone.`,
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        // Delete password from SecureStore if exists
                        if (password) {
                            await secureStorage.deletePassword(service.id);
                        }

                        deleteService(service.id, {
                            onSuccess: () => {
                                showToast.success('Service Deleted', `${service.serviceName} has been removed`);
                                router.back();
                            },
                        });
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return <LoadingScreen message="Loading your service..."/>;
    }

    if (serviceError) {
        return <ErrorScreen onRetry={() => refetch()}/>
    }

    if (!service) {
        return (
            <View className="flex-1 bg-slate-50 dark:bg-slate-900">
                <StatusBar style={actualTheme === 'dark' ? 'light' : 'dark'}/>
                <View
                    className="bg-white dark:bg-slate-800 pt-14 pb-4 px-6 border-b border-slate-200 dark:border-slate-700">
                    <View className="flex-row items-center justify-between">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 rounded-full items-center justify-center bg-slate-100 dark:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600"
                            accessibilityLabel="Go back"
                        >
                            <Ionicons name="chevron-back" size={22} color="#0f172a"/>
                        </TouchableOpacity>
                        <Text className="text-slate-900 dark:text-slate-100 font-bold text-xl">Service</Text>
                        <View className="w-10"/>
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
        <View className="flex-1 bg-slate-50 dark:bg-slate-900">
            <StatusBar style={actualTheme === 'dark' ? 'light' : 'dark'}/>

            {/* Header */}
            <View
                className="bg-white dark:bg-slate-800 pt-14 pb-4 px-6 border-b border-slate-200 dark:border-slate-700">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full items-center justify-center bg-slate-100 dark:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600"
                        accessibilityLabel="Go back"
                    >
                        <Ionicons name="chevron-back" size={22} color={actualTheme === 'dark' ? '#cbd5e1' : '#374151'}/>
                    </TouchableOpacity>
                    <Text className="text-slate-900 dark:text-slate-100 font-bold text-xl flex-1 text-center mx-2"
                          numberOfLines={1}>
                        {service.serviceName}
                    </Text>
                    <View className="flex-row gap-2">
                        <TouchableOpacity
                            onPress={handleEdit}
                            className="w-10 h-10 rounded-full items-center justify-center bg-blue-50 dark:bg-blue-900 active:bg-blue-100 dark:active:bg-blue-800"
                            accessibilityLabel="Edit service"
                        >
                            <Ionicons name="pencil" size={20} color="#3b82f6"/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleDelete}
                            className="w-10 h-10 rounded-full items-center justify-center bg-red-50 dark:bg-red-900/30 active:bg-red-100 dark:active:bg-red-800/50"
                            accessibilityLabel="Delete service"
                            disabled={deleting}
                        >
                            <Ionicons name="trash" size={20} color="#ef4444"/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
                {/* Header Card */}
                <View
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-4 mb-4 shadow-sm">
                    <View className="flex-row items-center">
                        <View className="w-14 h-14 rounded-xl items-center justify-center mr-3"
                              style={{backgroundColor: category.color + '20'}}>
                            <Ionicons name={category.icon as any} size={26} color={category.color}/>
                        </View>
                        <View className="flex-1">
                            <Text
                                className="text-slate-900 dark:text-slate-100 font-bold text-lg mb-1">{service.serviceName}</Text>
                            <View className="flex-row items-center flex-wrap gap-2">
                                <View className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700">
                                    <Text
                                        className="text-slate-700 dark:text-slate-300 text-xs font-semibold">{category.name}</Text>
                                </View>
                                {service.hasPassword ? (
                                    <View className="px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/30">
                                        <Text className="text-green-600 dark:text-green-400 text-xs font-semibold">Has
                                            Password</Text>
                                    </View>
                                ) : (
                                    <View className="px-2 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/30">
                                        <Text className="text-yellow-600 dark:text-yellow-400 text-xs font-semibold">No
                                            Password</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </View>

                {/* Details */}
                <View
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-4 mb-4 shadow-sm">
                    {/* Email */}
                    <View className="flex-row items-center py-3 border-b border-slate-200 dark:border-slate-700">
                        <View
                            className="w-9 h-9 rounded-full items-center justify-center bg-slate-100 dark:bg-slate-700 mr-3">
                            <Ionicons name="mail" size={18} color="#475569"/>
                        </View>
                        <View className="flex-1">
                            <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">Email</Text>
                            <Text className="text-slate-900 dark:text-slate-100 font-semibold">{service.email}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => copyToClipboard(service.email, 'Email')}
                            className="bg-slate-100 dark:bg-slate-700 rounded-full p-2"
                        >
                            <Ionicons name="copy-outline" size={18} color="#475569"/>
                        </TouchableOpacity>
                    </View>

                    {/* Website */}
                    {service.website && (
                        <View className="flex-row items-center py-3 border-b border-slate-200 dark:border-slate-700">
                            <View
                                className="w-9 h-9 rounded-full items-center justify-center bg-slate-100 dark:bg-slate-700 mr-3">
                                <Ionicons name="globe" size={18} color="#475569"/>
                            </View>
                            <View className="flex-1">
                                <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">Website</Text>
                                <Text className="text-blue-600 font-semibold">{service.website}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={openWebsite}
                                className="bg-blue-50 dark:bg-blue-900 rounded-full p-2"
                            >
                                <Ionicons name="open-outline" size={18} color="#3b82f6"/>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Password */}
                    {password && (
                        <View className="flex-row items-center py-3">
                            <View
                                className="w-9 h-9 rounded-full items-center justify-center bg-green-100 dark:bg-green-900 mr-3">
                                <Ionicons name="lock-closed" size={18} color="#10b981"/>
                            </View>
                            <View className="flex-1">
                                <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">Password</Text>
                                <Text className="text-slate-900 dark:text-slate-100 font-semibold">
                                    {showPassword ? password : '••••••••••'}
                                </Text>
                            </View>
                            <View className="flex-row gap-2">
                                <TouchableOpacity
                                    onPress={handleViewPassword}
                                    className="bg-green-50 dark:bg-green-900 rounded-full p-2"
                                    disabled={loadingPassword}
                                >
                                    <Ionicons
                                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                        size={18}
                                        color="#10b981"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={copyPasswordToClipboard}
                                    className="bg-green-50 dark:bg-green-900 rounded-full p-2"
                                >
                                    <Ionicons name="copy-outline" size={18} color="#10b981"/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>

                {/* Security Notice for Password */}
                {password && (
                    <View
                        className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-2xl p-4 mb-4">
                        <View className="flex-row items-start">
                            <Ionicons name="shield-checkmark" size={20} color="#10b981"
                                      style={{marginRight: 8, marginTop: 2}}/>
                            <View className="flex-1">
                                <Text className="text-green-900 dark:text-green-100 font-semibold mb-1">Secure
                                    Storage</Text>
                                <Text className="text-green-700 dark:text-green-300 text-xs">
                                    Password is encrypted and stored securely on your device. Biometric authentication
                                    is required to view or copy it.
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Notes */}
                {service.notes && (
                    <View
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-4 mb-4 shadow-sm">
                        <View className="flex-row items-center mb-2">
                            <Ionicons name="document-text" size={18} color="#94a3b8" style={{marginRight: 6}}/>
                            <Text className="text-slate-900 dark:text-slate-100 font-semibold">Notes</Text>
                        </View>
                        <Text className="text-slate-700 dark:text-slate-300 leading-5">{service.notes}</Text>
                    </View>
                )}

                {/* Meta */}
                <View
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-4 mb-6 shadow-sm">
                    <View className="flex-row items-center mb-2">
                        <Ionicons name="time-outline" size={16} color="#94a3b8" style={{marginRight: 6}}/>
                        <Text className="text-slate-500 dark:text-slate-400 text-xs">
                            Created: {new Date(service.createdAt).toLocaleDateString()} at {new Date(service.createdAt).toLocaleTimeString()}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons name="refresh-outline" size={16} color="#94a3b8" style={{marginRight: 6}}/>
                        <Text className="text-slate-500 dark:text-slate-400 text-xs">
                            Updated: {new Date(service.updatedAt).toLocaleDateString()} at {new Date(service.updatedAt).toLocaleTimeString()}
                        </Text>
                    </View>
                </View>

                <View className="h-4"/>
            </ScrollView>
        </View>

    );
}
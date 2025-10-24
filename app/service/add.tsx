import React, {useEffect, useMemo, useState} from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {router} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {categories} from '@/constants/categories';
import {useCreateService} from '@/services/queries/serviceQueries';
import {secureStorage} from "@/services/secureStorage";
import {useTheme} from "@/components/ThemeProvider";

export default function AddService() {
    const [serviceName, setServiceName] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [notes, setNotes] = useState('');
    const [hasPassword, setHasPassword] = useState(true);
    const [categoryId, setCategoryId] = useState<string | null>(null);
    const { actualTheme } = useTheme();

    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordFeatureEnabled, setPasswordFeatureEnabled] = useState(false);

    const {mutate: createService, isPending} = useCreateService();

    useEffect(() => {
        const checkPasswordFeature = async () => {
            const enabled = await secureStorage.isPasswordFeatureEnabled();
            setPasswordFeatureEnabled(enabled);
        };
        checkPasswordFeature();
    }, []);

    const errors = useMemo(() => {
        const e: Record<string, string> = {};
        if (!serviceName.trim()) e.serviceName = 'Service name is required';
        if (!email.trim()) e.email = 'Email is required';
        if (!categoryId) e.categoryId = 'Choose a category';
        return e;
    }, [serviceName, email, categoryId]);

    const canSubmit = useMemo(() => Object.keys(errors).length === 0, [errors]);

    const handleSubmit = () => {
        if (!canSubmit) return;
        createService(
            {
                serviceName: serviceName.trim(),
                email: email.trim(),
                categoryId: categoryId as string,
                website: website.trim() || undefined,
                notes: notes.trim() || undefined,
                hasPassword,
            },
            {
                onSuccess: async (newService) => {
                    // Save password to SecureStore if provided and feature is enabled
                    if (password.trim() && passwordFeatureEnabled && hasPassword) {
                        await secureStorage.savePassword(newService.id, password.trim());
                    }
                    router.back();
                },
            }
        );
    };

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
                        <Ionicons
                            name="chevron-back"
                            size={22}
                            color={actualTheme === 'dark' ? '#f1f5f9' : '#111827'}
                        />
                    </TouchableOpacity>
                    <Text className="text-slate-900 dark:text-slate-100 font-bold text-xl">Add Service</Text>
                    <View className="w-10"/>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                keyboardVerticalOffset={100}
            >
                <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
                    {/* Service Name */}
                    <View className="mb-4">
                        <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-2">
                            Service Name
                        </Text>
                        <TextInput
                            value={serviceName}
                            onChangeText={setServiceName}
                            placeholder="e.g., Netflix"
                            placeholderTextColor={actualTheme === 'dark' ? '#64748b' : '#9ca3af'}
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100"
                            autoCapitalize="words"
                            returnKeyType="next"
                        />
                        {errors.serviceName ? (
                            <Text className="text-red-500 dark:text-red-400 text-xs mt-1">
                                {errors.serviceName}
                            </Text>
                        ) : null}
                    </View>

                    {/* Email */}
                    <View className="mb-4">
                        <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-2">
                            Email
                        </Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="e.g., you@example.com"
                            placeholderTextColor={actualTheme === 'dark' ? '#64748b' : '#9ca3af'}
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType="next"
                        />
                        {errors.email ? (
                            <Text className="text-red-500 dark:text-red-400 text-xs mt-1">
                                {errors.email}
                            </Text>
                        ) : null}
                    </View>

                    {/* Category */}
                    <View className="mb-6">
                        <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-2">
                            Category
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="-mx-2"
                        >
                            {categories.map(cat => {
                                const selected = categoryId === cat.id;
                                return (
                                    <TouchableOpacity
                                        key={cat.id}
                                        onPress={() => setCategoryId(cat.id)}
                                        className={`mx-2 mb-2 px-4 py-2 rounded-full flex-row items-center ${
                                            selected
                                                ? 'bg-blue-600 dark:bg-blue-500'
                                                : 'bg-slate-100 dark:bg-slate-700'
                                        }`}
                                    >
                                        <Ionicons
                                            name={cat.icon as any}
                                            size={16}
                                            color={selected ? 'white' : (actualTheme === 'dark' ? '#cbd5e1' : '#374151')}
                                        />
                                        <Text
                                            className={`ml-1 font-semibold ${
                                                selected
                                                    ? 'text-white'
                                                    : 'text-slate-700 dark:text-slate-300'
                                            }`}
                                        >
                                            {cat.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                        {errors.categoryId ? (
                            <Text className="text-red-500 dark:text-red-400 text-xs mt-1">
                                {errors.categoryId}
                            </Text>
                        ) : null}
                    </View>

                    {/* Website */}
                    <View className="mb-4">
                        <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-2">
                            Website (optional)
                        </Text>
                        <TextInput
                            value={website}
                            onChangeText={setWebsite}
                            placeholder="e.g., netflix.com"
                            placeholderTextColor={actualTheme === 'dark' ? '#64748b' : '#9ca3af'}
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100"
                            autoCapitalize="none"
                            keyboardType="url"
                            returnKeyType="next"
                        />
                    </View>

                    {/* Notes */}
                    <View className="mb-4">
                        <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-2">
                            Notes (optional)
                        </Text>
                        <TextInput
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="Add any details..."
                            placeholderTextColor={actualTheme === 'dark' ? '#64748b' : '#9ca3af'}
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-slate-100"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Has Password Toggle */}
                    <View
                        className="mb-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 flex-row items-center justify-between">
                        <View>
                            <Text className="text-slate-900 dark:text-slate-100 font-semibold">
                                Has Password
                            </Text>
                            <Text className="text-slate-500 dark:text-slate-400 text-xs">
                                Track if this service has a saved password
                            </Text>
                        </View>
                        <Switch
                            value={hasPassword}
                            onValueChange={setHasPassword}
                            trackColor={{false: '#cbd5e1', true: '#3b82f6'}}
                            thumbColor={hasPassword ? '#ffffff' : '#f1f5f9'}
                        />
                    </View>

                    {/* Password Field - Only show if feature is enabled */}
                    {hasPassword && (
                        <View className="mb-6">
                            {passwordFeatureEnabled ? (
                                <>
                                    <Text className="text-slate-700 dark:text-slate-300 font-semibold mb-2">
                                        Password (optional)
                                    </Text>
                                    <View
                                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 flex-row items-center">
                                        <Ionicons
                                            name="lock-closed"
                                            size={20}
                                            color={actualTheme === 'dark' ? '#64748b' : '#9ca3af'}
                                            style={{marginRight: 12}}
                                        />
                                        <TextInput
                                            value={password}
                                            onChangeText={setPassword}
                                            placeholder="Enter password to save securely"
                                            placeholderTextColor={actualTheme === 'dark' ? '#64748b' : '#9ca3af'}
                                            className="flex-1 text-slate-900 dark:text-slate-100"
                                            secureTextEntry={!showPassword}
                                            autoCapitalize="none"
                                        />
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                            <Ionicons
                                                name={showPassword ? 'eye-off' : 'eye'}
                                                size={20}
                                                color={actualTheme === 'dark' ? '#64748b' : '#9ca3af'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View className="flex-row items-start mt-2">
                                        <Ionicons
                                            name="shield-checkmark"
                                            size={14}
                                            color="#10b981"
                                            style={{marginTop: 2, marginRight: 4}}
                                        />
                                        <Text className="text-green-600 dark:text-green-500 text-xs flex-1">
                                            Password will be encrypted and stored securely on your device
                                        </Text>
                                    </View>
                                </>
                            ) : (
                                <View
                                    className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                    <View className="flex-row items-start">
                                        <Ionicons
                                            name="information-circle"
                                            size={20}
                                            color="#3b82f6"
                                            style={{marginRight: 8}}
                                        />
                                        <View className="flex-1">
                                            <Text className="text-blue-900 dark:text-blue-100 font-semibold mb-1">
                                                Password Storage Disabled
                                            </Text>
                                            <Text className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                                                Enable password storage in Settings to save passwords securely with
                                                biometric protection.
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => router.push('/(tabs)/settings')}
                                                className="bg-blue-600 dark:bg-blue-500 px-4 py-2 rounded-full self-start"
                                            >
                                                <Text className="text-white font-semibold text-sm">
                                                    Go to Settings
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Actions */}
                    <View className="mt-2 mb-8">
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={!canSubmit || isPending}
                            className={`rounded-xl py-4 items-center ${
                                !canSubmit || isPending
                                    ? 'bg-slate-300 dark:bg-slate-700'
                                    : 'bg-blue-600 dark:bg-blue-500'
                            }`}
                        >
                            <Text className="text-white font-semibold text-base">
                                {isPending ? 'Saving...' : 'Save Service'}
                            </Text>
                        </TouchableOpacity>

                        <View className="h-3"/>

                        <TouchableOpacity
                            onPress={() => router.back()}
                            disabled={isPending}
                            className="border border-slate-300 dark:border-slate-600 rounded-xl py-4 items-center"
                        >
                            <Text className="text-slate-700 dark:text-slate-300 font-semibold text-base">
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

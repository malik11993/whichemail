import React, {useEffect, useMemo, useState} from 'react';
import {
    Alert,
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
import {router, useLocalSearchParams} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import Button from '@/components/common/Button';
import LoadingScreen from '@/components/common/LoadingScreen';
import {categories} from '@/constants/categories';
import {useService, useUpdateService} from '@/services/queries/serviceQueries';
import {secureStorage} from '@/services/secureStorage';
import {showToast} from '@/utils/toast';

export default function EditService() {
    const {id} = useLocalSearchParams<{ id: string }>();
    const {data: service, isLoading} = useService(id as string);
    const {mutate: updateService, isPending} = useUpdateService();

    const [serviceName, setServiceName] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');
    const [notes, setNotes] = useState('');
    const [hasPassword, setHasPassword] = useState(false);
    const [categoryId, setCategoryId] = useState<string | null>(null);

    // Password management
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordFeatureEnabled, setPasswordFeatureEnabled] = useState(false);
    const [existingPassword, setExistingPassword] = useState<string | null>(null);
    const [passwordAuthenticated, setPasswordAuthenticated] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(false);

    useEffect(() => {
        if (service) {
            setServiceName(service.serviceName);
            setEmail(service.email);
            setWebsite(service.website || '');
            setNotes(service.notes || '');
            setHasPassword(service.hasPassword);
            setCategoryId(service.categoryId);

            // Check password feature and load existing password
            checkPasswordSetup();
        }
    }, [service]);

    const checkPasswordSetup = async () => {
        if (!service?.id) return;

        try {
            // Check if password feature is enabled
            const enabled = await secureStorage.isPasswordFeatureEnabled();
            setPasswordFeatureEnabled(enabled);

            // Check if service has existing password
            if (service.hasPassword) {
                const savedPassword = await secureStorage.getPassword(service.id);
                if (savedPassword) {
                    setExistingPassword(savedPassword);
                }
            }
        } catch (error) {
            console.error('Error checking password setup:', error);
        }
    };

    const handleAuthenticateForPassword = async () => {
        if (passwordAuthenticated) {
            // Already authenticated, just toggle visibility
            setShowPassword(!showPassword);
            return;
        }

        setLoadingAuth(true);
        try {
            // Check biometric availability
            const compatible = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();

            if (!compatible || !enrolled) {
                Alert.alert(
                    'Biometric Not Available',
                    'Please set up Face ID or Fingerprint to view/edit passwords.',
                    [{text: 'OK'}]
                );
                setLoadingAuth(false);
                return;
            }

            // Get biometric type
            const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
            let biometricType = 'biometric authentication';

            if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                biometricType = 'Face ID';
            } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                biometricType = 'fingerprint';
            }

            // Authenticate
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: `Use ${biometricType} to edit password`,
                fallbackLabel: 'Use passcode',
                cancelLabel: 'Cancel',
            });

            if (result.success) {
                setPasswordAuthenticated(true);
                if (existingPassword) {
                    setPassword(existingPassword);
                }
                setShowPassword(true);
                showToast.success('Authenticated', 'You can now edit the password');
            } else {
                showToast.error('Authentication Failed', 'Please try again');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            showToast.error('Error', 'Failed to authenticate');
        } finally {
            setLoadingAuth(false);
        }
    };

    const errors = useMemo(() => {
        const e: Record<string, string> = {};
        if (!serviceName.trim()) e.serviceName = 'Service name is required';
        if (!email.trim()) e.email = 'Email is required';
        if (!categoryId) e.categoryId = 'Choose a category';
        return e;
    }, [serviceName, email, categoryId]);

    const canSubmit = useMemo(() => Object.keys(errors).length === 0, [errors]);

    const hasChanges = useMemo(() => {
        if (!service) return false;
        return (
            serviceName.trim() !== service.serviceName ||
            email.trim() !== service.email ||
            website.trim() !== (service.website || '') ||
            notes.trim() !== (service.notes || '') ||
            hasPassword !== service.hasPassword ||
            categoryId !== service.categoryId ||
            (passwordAuthenticated && password !== existingPassword)
        );
    }, [service, serviceName, email, website, notes, hasPassword, categoryId, password, passwordAuthenticated, existingPassword]);

    const handleSubmit = async () => {
        if (!canSubmit || !service?.id) return;

        // Show confirmation if there are no changes
        if (!hasChanges) {
            Alert.alert(
                'No Changes',
                'You haven\'t made any changes to save.',
                [{text: 'OK'}]
            );
            return;
        }

        updateService(
            {
                id: service.id,
                service: {
                    serviceName: serviceName.trim(),
                    email: email.trim(),
                    categoryId: categoryId as string,
                    website: website.trim() || undefined,
                    notes: notes.trim() || undefined,
                    hasPassword,
                },
            },
            {
                onSuccess: async () => {
                    // Handle password changes
                    if (passwordAuthenticated && password.trim() && passwordFeatureEnabled && hasPassword) {
                        // Save new/updated password
                        await secureStorage.savePassword(service.id, password.trim());
                    } else if (!hasPassword && existingPassword) {
                        // Delete password if hasPassword was toggled off
                        await secureStorage.deletePassword(service.id);
                    }

                    router.back();
                },
            }
        );
    };

    const handleCancel = () => {
        if (hasChanges) {
            Alert.alert(
                'Discard Changes?',
                'You have unsaved changes. Are you sure you want to go back?',
                [
                    {text: 'Keep Editing', style: 'cancel'},
                    {
                        text: 'Discard',
                        style: 'destructive',
                        onPress: () => router.back(),
                    },
                ]
            );
        } else {
            router.back();
        }
    };

    if (isLoading) {
        return <LoadingScreen message="Loading service..."/>;
    }

    if (!service) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <Text className="text-gray-500">Service not found</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar style="dark"/>

            {/* Header */}
            <View className="bg-white pt-14 pb-4 px-6 border-b border-gray-100">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={handleCancel}
                        className="w-10 h-10 rounded-full items-center justify-center bg-gray-100 active:bg-gray-200"
                        accessibilityLabel="Go back"
                    >
                        <Ionicons name="chevron-back" size={22} color="#111827"/>
                    </TouchableOpacity>
                    <Text className="text-gray-900 font-bold text-xl">Edit Service</Text>
                    <View className="w-10"/>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
                    {/* Service Name */}
                    <View className="mb-4">
                        <Text className="text-gray-700 font-semibold mb-2">Service Name</Text>
                        <TextInput
                            value={serviceName}
                            onChangeText={setServiceName}
                            placeholder="e.g., Netflix"
                            placeholderTextColor="#9ca3af"
                            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                            autoCapitalize="words"
                            returnKeyType="next"
                        />
                        {errors.serviceName ? (
                            <Text className="text-red-500 text-xs mt-1">{errors.serviceName}</Text>
                        ) : null}
                    </View>

                    {/* Email */}
                    <View className="mb-4">
                        <Text className="text-gray-700 font-semibold mb-2">Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="e.g., you@example.com"
                            placeholderTextColor="#9ca3af"
                            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType="next"
                        />
                        {errors.email ? (
                            <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
                        ) : null}
                    </View>

                    {/* Category */}
                    <View className="mb-6">
                        <Text className="text-gray-700 font-semibold mb-2">Category</Text>
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
                                            selected ? 'bg-blue-600' : 'bg-gray-100'
                                        }`}
                                    >
                                        <Ionicons
                                            name={cat.icon as any}
                                            size={16}
                                            color={selected ? 'white' : '#374151'}
                                        />
                                        <Text
                                            className={`ml-1 font-semibold ${
                                                selected ? 'text-white' : 'text-gray-700'
                                            }`}
                                        >
                                            {cat.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                        {errors.categoryId ? (
                            <Text className="text-red-500 text-xs mt-1">{errors.categoryId}</Text>
                        ) : null}
                    </View>

                    {/* Website */}
                    <View className="mb-4">
                        <Text className="text-gray-700 font-semibold mb-2">Website (optional)</Text>
                        <TextInput
                            value={website}
                            onChangeText={setWebsite}
                            placeholder="e.g., netflix.com"
                            placeholderTextColor="#9ca3af"
                            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                            autoCapitalize="none"
                            keyboardType="url"
                            returnKeyType="next"
                        />
                    </View>

                    {/* Notes */}
                    <View className="mb-4">
                        <Text className="text-gray-700 font-semibold mb-2">Notes (optional)</Text>
                        <TextInput
                            value={notes}
                            onChangeText={setNotes}
                            placeholder="Add any details..."
                            placeholderTextColor="#9ca3af"
                            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* Has Password Toggle */}
                    <View
                        className="mb-6 bg-white border border-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between">
                        <View className="flex-1 mr-3">
                            <Text className="text-gray-900 font-semibold">Has Password</Text>
                            <Text className="text-gray-500 text-xs mt-0.5">
                                Track if this service has a saved password
                            </Text>
                        </View>
                        <Switch value={hasPassword} onValueChange={setHasPassword}/>
                    </View>

                    {/* Password Field */}
                    {hasPassword && (
                        <View className="mb-6">
                            {passwordFeatureEnabled ? (
                                <>
                                    {!passwordAuthenticated ? (
                                        // Show authenticate button
                                        <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                            <View className="flex-row items-start mb-3">
                                                <Ionicons
                                                    name="lock-closed"
                                                    size={20}
                                                    color="#3b82f6"
                                                    style={{marginRight: 8}}
                                                />
                                                <View className="flex-1">
                                                    <Text className="text-blue-900 font-semibold mb-1">
                                                        Password Protected
                                                    </Text>
                                                    <Text className="text-blue-700 text-sm">
                                                        {existingPassword
                                                            ? 'Authenticate to view and edit the saved password'
                                                            : 'Authenticate to add a new password'}
                                                    </Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity
                                                onPress={handleAuthenticateForPassword}
                                                disabled={loadingAuth}
                                                className="bg-blue-600 px-4 py-3 rounded-xl flex-row items-center justify-center"
                                            >
                                                <Ionicons
                                                    name="finger-print"
                                                    size={20}
                                                    color="white"
                                                    style={{marginRight: 8}}
                                                />
                                                <Text className="text-white font-semibold">
                                                    {loadingAuth ? 'Authenticating...' : 'Authenticate to Edit Password'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        // Show password field after authentication
                                        <>
                                            <Text className="text-gray-700 font-semibold mb-2">
                                                Password {existingPassword ? '(Edit)' : '(New)'}
                                            </Text>
                                            <View
                                                className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex-row items-center mb-2">
                                                <Ionicons
                                                    name="lock-closed"
                                                    size={20}
                                                    color="#10b981"
                                                    style={{marginRight: 10}}
                                                />
                                                <TextInput
                                                    value={password}
                                                    onChangeText={setPassword}
                                                    placeholder={existingPassword ? 'Edit password' : 'Enter new password'}
                                                    placeholderTextColor="#9ca3af"
                                                    className="flex-1 text-gray-900"
                                                    secureTextEntry={!showPassword}
                                                    autoCapitalize="none"
                                                />
                                                <TouchableOpacity
                                                    onPress={() => setShowPassword(!showPassword)}
                                                >
                                                    <Ionicons
                                                        name={showPassword ? 'eye-off' : 'eye'}
                                                        size={20}
                                                        color="#9ca3af"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <View className="flex-row items-start">
                                                <Ionicons
                                                    name="shield-checkmark"
                                                    size={14}
                                                    color="#10b981"
                                                    style={{marginTop: 2, marginRight: 4}}
                                                />
                                                <Text className="text-green-600 text-xs flex-1">
                                                    {existingPassword
                                                        ? 'Update the password or leave unchanged'
                                                        : 'Password will be encrypted and stored securely'}
                                                </Text>
                                            </View>
                                        </>
                                    )}
                                </>
                            ) : (
                                // Password feature disabled
                                <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <View className="flex-row items-start">
                                        <Ionicons
                                            name="information-circle"
                                            size={20}
                                            color="#3b82f6"
                                            style={{marginRight: 8}}
                                        />
                                        <View className="flex-1">
                                            <Text className="text-blue-900 font-semibold mb-1">
                                                Password Storage Disabled
                                            </Text>
                                            <Text className="text-blue-700 text-sm mb-3">
                                                Enable password storage in Settings to save passwords securely.
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() => router.push('/(tabs)/settings')}
                                                className="bg-blue-600 px-4 py-2 rounded-full self-start"
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
                        <Button
                            title={isPending ? 'Saving...' : 'Save Changes'}
                            onPress={handleSubmit}
                            loading={isPending}
                            disabled={!canSubmit || !hasChanges}
                        />
                        <View className="h-3"/>
                        <Button
                            title="Cancel"
                            onPress={handleCancel}
                            variant="outline"
                            disabled={isPending}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
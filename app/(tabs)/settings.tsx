import {Alert, Linking, ScrollView, Switch, Text, TouchableOpacity, View,} from 'react-native';
import {useEffect, useState} from 'react';
import {router} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {StatusBar} from 'expo-status-bar';
import {secureStorage} from "@/services/secureStorage";
import {showToast} from "@/utils/toast";
import {useLogout} from "@/services/hooks/useAuth";
import {useUser} from "@/services/hooks/userQueries";
import {authenticateUser, getAuthenticationTypeName, isAuthenticationAvailable} from "@/utils/authUtils";


export default function Settings() {
    const [passwordFeatureEnabled, setPasswordFeatureEnabled] = useState(false);
    const [biometricAvailable, setBiometricAvailable] = useState(false);
    const [biometricType, setBiometricType] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const {data: user} = useUser();
    const {mutate: logOut} = useLogout();

    const whatsappNumber = "237670242458";
    const message = "Hello Fanyi, from WhichEmail App! 👋 I’d love to share some feedback about WhichEmail.";
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    useEffect(() => {
        checkSettings();
    }, []);

    const openWhatsApp = async () => {
        try {
            showToast.info("Opening WhatsApp...");
            await Linking.openURL(whatsappLink);
        } catch (error) {
            showToast.error("Error Opening Whatsapp!", "Please ensure you have whatsapp installed or try again later.");
            console.error("Error opening WhatsApp:", error);
        }
    };


    const checkSettings = async () => {
        try {
            // Check if password feature is enabled
            const enabled = await secureStorage.isPasswordFeatureEnabled();
            setPasswordFeatureEnabled(enabled);

            // Check biometric availability
            const authenticationAvailable = await isAuthenticationAvailable();
            setBiometricAvailable(authenticationAvailable);

            if (authenticationAvailable) {
                const authType = await getAuthenticationTypeName();
                setBiometricType(authType);
            }
        } catch (error) {
            console.error('Error checking settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordFeature = async (value: boolean) => {
        if (value) {
            // Enabling - require authentication
            const result = await authenticateUser({
                purpose: 'enable-password',
                showSuccessToast: true,
                successMessage: 'You can now save passwords securely',
            });

            if (result.success) {
                await secureStorage.setPasswordFeature(true);
                setPasswordFeatureEnabled(true);
            }
        } else {
            // Disabling - show confirmation
            Alert.alert(
                'Disable Password Storage?',
                'This will not delete existing passwords, but you won\'t be able to add new ones until you enable it again.',
                [
                    {text: 'Cancel', style: 'cancel'},
                    {
                        text: 'Disable',
                        style: 'destructive',
                        onPress: async () => {
                            await secureStorage.setPasswordFeature(false);
                            setPasswordFeatureEnabled(false);
                            showToast.info('Password Storage Disabled!', 'Password temporarily storage disabled');
                        },
                    },
                ]
            );
        }
    };


    const handleDeleteAllPasswords = () => {
        Alert.alert(
            'Delete All Passwords?',
            'This action cannot be undone. All saved passwords will be permanently deleted.',
            [
                {text: 'Cancel', style: 'cancel'},
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        // TODO: Implement delete all passwords
                        showToast.success('All Passwords Deleted');
                    },
                },
            ]
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar style="dark"/>

            {/* Header */}
            <View className="bg-white pt-14 pb-4 px-6 border-b border-gray-100">
                <Text className="text-gray-900 font-bold text-2xl">Settings</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Profile Section */}
                <View className="px-6 py-6">
                    <View className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 shadow-sm">
                        <View className="flex-row items-center">
                            <View className="bg-white/20 rounded-full w-16 h-16 items-center justify-center mr-4">
                                <Ionicons name="person" size={32} color="gray"/>
                            </View>
                            <View className="flex-1">
                                <Text className="text-blue-500 font-bold text-xl mb-1">
                                    {user?.name}
                                </Text>
                                <Text className="text-blue-400 text-sm">
                                    {user?.email}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Security Section */}
                <View className="px-6 pb-4">
                    <Text className="text-gray-900 font-bold text-lg mb-3">Security</Text>

                    {/* Password Storage Toggle */}
                    <View className="bg-white rounded-2xl mb-3 shadow-sm border border-gray-100">
                        <View className="px-4 py-4 flex-row items-center justify-between">
                            <View className="flex-row items-center flex-1">
                                <View className="bg-blue-100 rounded-full p-2 mr-3">
                                    <Ionicons name="lock-closed" size={20} color="#3b82f6"/>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-900 font-semibold">
                                        Password Storage
                                    </Text>
                                    <Text className="text-gray-500 text-xs mt-0.5">
                                        Save passwords with {biometricType || 'biometric'} protection
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={passwordFeatureEnabled}
                                onValueChange={togglePasswordFeature}
                                disabled={loading}
                            />
                        </View>

                        {/* Biometric Status */}
                        {!biometricAvailable && (
                            <View className="px-4 pb-4 pt-2 border-t border-gray-100">
                                <View className="flex-row items-start">
                                    <Ionicons
                                        name="alert-circle"
                                        size={16}
                                        color="#f59e0b"
                                        style={{marginTop: 2, marginRight: 6}}
                                    />
                                    <Text className="text-amber-600 text-xs flex-1">
                                        Biometric authentication not available. Please enable Face ID or
                                        Fingerprint in your device settings.
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Delete All Passwords */}
                    {passwordFeatureEnabled && (
                        <TouchableOpacity
                            onPress={handleDeleteAllPasswords}
                            className="bg-white rounded-2xl px-4 py-4 flex-row items-center shadow-sm border border-gray-100"
                        >
                            <View className="bg-red-100 rounded-full p-2 mr-3">
                                <Ionicons name="trash" size={20} color="#ef4444"/>
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 font-semibold">
                                    Delete All Passwords
                                </Text>
                                <Text className="text-gray-500 text-xs mt-0.5">
                                    Permanently remove all saved passwords
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9ca3af"/>
                        </TouchableOpacity>
                    )}
                </View>

                {/* App Info Section */}
                <View className="px-6 pb-4">
                    <Text className="text-gray-900 font-bold text-lg mb-3">
                        Information
                    </Text>

                    <View className="bg-white rounded-2xl shadow-sm border border-gray-100">
                        {/* About */}
                        <TouchableOpacity className="px-4 py-4 flex-row items-center border-b border-gray-100"
                                          onPress={() => router.push("/service/about")}
                        >
                            <View className="bg-purple-100 rounded-full p-2 mr-3">
                                <Ionicons name="information-circle" size={20} color="#8b5cf6"/>
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 font-semibold">About WhichEmail</Text>
                                <Text className="text-gray-500 text-xs mt-0.5">
                                    Learn more about WhichEmail
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9ca3af"/>
                        </TouchableOpacity>

                        {/* Privacy Policy */}
                        <TouchableOpacity className="px-4 py-4 flex-row items-center border-b border-gray-100"
                                          onPress={() => showToast.info("Private policy coming soon!")}
                        >
                            <View className="bg-green-100 rounded-full p-2 mr-3">
                                <Ionicons name="shield-checkmark" size={20} color="#10b981"/>
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 font-semibold">
                                    Privacy Policy
                                </Text>
                                <Text className="text-gray-500 text-xs mt-0.5">
                                    How we handle your data
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9ca3af"/>
                        </TouchableOpacity>

                        {/* Terms of Service */}
                        <TouchableOpacity className="px-4 py-4 flex-row items-center border-b border-gray-100"
                                          onPress={() => showToast.info("Terms of Service coming soon!")}
                        >
                            <View className="bg-orange-100 rounded-full p-2 mr-3"
                            >
                                <Ionicons name="document-text" size={20} color="#f97316"/>
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 font-semibold">
                                    Terms of Service
                                </Text>
                                <Text className="text-gray-500 text-xs mt-0.5">
                                    Our terms and conditions
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#9ca3af"/>
                        </TouchableOpacity>

                        {/* Version */}
                        <View className="px-4 py-4 flex-row items-center">
                            <View className="bg-gray-100 rounded-full p-2 mr-3">
                                <Ionicons name="code-slash" size={20} color="#6b7280"/>
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 font-semibold">Version</Text>
                                <Text className="text-gray-500 text-xs mt-0.5">1.0.0</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Account Section */}
                <View className="px-6 pb-8">
                    <Text className="text-gray-900 font-bold text-lg mb-3">Account</Text>

                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                'Sign Out',
                                'Are you sure you want to sign out?',
                                [
                                    {text: 'Cancel', style: 'cancel'},
                                    {
                                        text: 'Sign Out',
                                        style: 'destructive',
                                        onPress: () => {
                                            logOut();
                                            router.replace('/(auth)/login');
                                        },
                                    },
                                ]
                            );
                        }}
                        className="bg-white rounded-2xl px-4 py-4 flex-row items-center shadow-sm border border-red-200"
                    >
                        <View className="bg-red-100 rounded-full p-2 mr-3">
                            <Ionicons name="log-out" size={20} color="#ef4444"/>
                        </View>
                        <View className="flex-1">
                            <Text className="text-red-600 font-semibold">Sign Out</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#ef4444"/>
                    </TouchableOpacity>
                </View>

                {/* Creator Credit */}
                {/* Creator Credit */}
                <View className="px-6 pb-12 mt-10">
                    <View className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                        <View className="flex-row items-center mb-2">
                            <Ionicons name="heart" size={16} color="#ef4444"/>
                            <Text className="text-gray-700 text-sm ml-2">Made with love by</Text>
                        </View>

                        <Text className="text-gray-900 font-bold text-lg">Fanyi Charllson</Text>
                        <Text className="text-gray-600 text-sm mt-1">
                            Building tools to make life easier, one app at a time.
                        </Text>

                        {/* WhatsApp Button */}
                        <TouchableOpacity
                            onPress={openWhatsApp}
                            className="mt-5 bg-blue-600 py-3 px-5 rounded-xl flex-row items-center justify-center"
                        >
                            <Ionicons name="logo-whatsapp" size={20} color="#fff"/>
                            <Text className="text-white font-semibold text-base ml-2">
                                Let’s Chat / Feedback
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
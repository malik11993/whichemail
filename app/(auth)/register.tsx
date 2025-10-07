import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Input from "@/components/forms/Input";
import Button from "@/components/common/Button";
import {showToast} from "@/utils/toast";

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const validateForm = () => {
        let valid = true;
        const newErrors = { name: '', email: '', password: '', confirmPassword: '' };

        // Name validation
        if (!name.trim()) {
            newErrors.name = 'Name is required';
            valid = false;
        }

        // Email validation
        if (!email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email';
            valid = false;
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
            valid = false;
        }

        // Confirm password validation
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
            valid = false;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // TODO: Implement Appwrite registration
            console.log('Register:', { name, email, password });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success toast
            showToast.success(
                'Account Created! 🎉',
                'Welcome to WhichEmail'
            );

            // Navigate to tabs after successful registration
            router.replace('/(tabs)/services');
        } catch (error) {
            console.error('Registration error:', error);
            showToast.error(
                'Registration Failed! 😞',
                'Something went wrong. Please try again.'
            );
            // Handle error
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <StatusBar style="dark" />
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View className="px-6 pt-16 pb-8">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center bg-gray-100 rounded-full mb-6"
                    >
                        <Ionicons name="arrow-back" size={24} color="#374151" />
                    </TouchableOpacity>

                    <View className="mb-2">
                        <Text className="text-4xl font-bold text-gray-900 mb-2">
                            Create Account 🚀
                        </Text>
                        <Text className="text-gray-600 text-base">
                            Sign up to start tracking your emails
                        </Text>
                    </View>
                </View>

                {/* Form */}
                <View className="px-6 flex-1">
                    <Input
                        label="Full Name"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            setErrors({ ...errors, name: '' });
                        }}
                        placeholder="John Doe"
                        icon="person"
                        autoCapitalize="words"
                        error={errors.name}
                    />

                    <Input
                        label="Email Address"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setErrors({ ...errors, email: '' });
                        }}
                        placeholder="example@email.com"
                        icon="mail"
                        keyboardType="email-address"
                        error={errors.email}
                    />

                    <Input
                        label="Password"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setErrors({ ...errors, password: '' });
                        }}
                        placeholder="Create a password (min. 8 characters)"
                        icon="lock-closed"
                        secureTextEntry
                        error={errors.password}
                    />

                    <Input
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            setErrors({ ...errors, confirmPassword: '' });
                        }}
                        placeholder="Re-enter your password"
                        icon="lock-closed"
                        secureTextEntry
                        error={errors.confirmPassword}
                    />

                    {/* Terms and Conditions */}
                    <View className="flex-row items-start mb-6">
                        <Ionicons name="information-circle" size={16} color="#6b7280" style={{ marginTop: 2, marginRight: 6 }} />
                        <Text className="flex-1 text-gray-600 text-sm">
                            By signing up, you agree to our{' '}
                            <Text className="text-blue-600 font-semibold">Terms of Service</Text>
                            {' '}and{' '}
                            <Text className="text-blue-600 font-semibold">Privacy Policy</Text>
                        </Text>
                    </View>

                    <Button
                        title="Create Account"
                        onPress={handleRegister}
                        loading={loading}
                    />

                    {/* Divider */}
                    <View className="flex-row items-center my-6">
                        <View className="flex-1 h-px bg-gray-300" />
                        <Text className="mx-4 text-gray-500">or</Text>
                        <View className="flex-1 h-px bg-gray-300" />
                    </View>

                    {/* Social Sign Up (Optional for future) */}
                    <TouchableOpacity className="flex-row items-center justify-center bg-white border-2 border-gray-200 rounded-xl py-4 mb-6">
                        <Ionicons name="logo-google" size={20} color="#4285F4" />
                        <Text className="ml-2 font-semibold text-gray-700">
                            Sign up with Google
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View className="px-6 pb-8">
                    <View className="flex-row items-center justify-center">
                        <Text className="text-gray-600">Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                            <Text className="text-blue-600 font-bold">Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
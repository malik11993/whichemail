import {KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View,} from 'react-native';
import {useState} from 'react';
import {router} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {StatusBar} from 'expo-status-bar';
import Input from "@/components/forms/Input";
import Button from "@/components/common/Button";
import {showToast} from "@/utils/toast";
import {useLogin} from "@/services/hooks/useAuth";


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({email: '', password: ''});
    const {mutate: loginUser, isPending} = useLogin();

    const validateForm = () => {
        let valid = true;
        const newErrors = {email: '', password: ''};

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
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        try {
            loginUser(
                {email, password},
                {
                    onSuccess: () => router.replace('/(tabs)'),
                }
            )
        } catch (error) {
            console.error('Login error:', error);
            showToast.error(
                'Login Failed',
                'Invalid email or password. Please try again.'
            );
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <StatusBar style="dark"/>
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View className="px-6 pt-16 pb-8">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center bg-gray-100 rounded-full mb-6"
                    >
                        <Ionicons name="arrow-back" size={24} color="#374151"/>
                    </TouchableOpacity>

                    <View className="mb-2">
                        <Text className="text-4xl font-bold text-gray-900 mb-2">
                            Welcome Back! 👋
                        </Text>
                        <Text className="text-gray-600 text-base">
                            Sign in to continue managing your emails
                        </Text>
                    </View>
                </View>

                {/* Form */}
                <View className="px-6 flex-1">
                    <Input
                        label="Email Address"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            setErrors({...errors, email: ''});
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
                            setErrors({...errors, password: ''});
                        }}
                        placeholder="Enter your password"
                        icon="lock-closed"
                        secureTextEntry
                        error={errors.password}
                    />

                    <TouchableOpacity className="mb-6"
                                      onPress={() => showToast.info("Coming Soon!")}
                    >
                        <Text className="text-blue-600 font-semibold text-right">
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    <Button
                        title="Sign In"
                        onPress={handleLogin}
                        loading={isPending}
                    />

                    {/* Divider */}
                    <View className="flex-row items-center my-6">
                        <View className="flex-1 h-px bg-gray-300"/>
                        <Text className="mx-4 text-gray-500">or</Text>
                        <View className="flex-1 h-px bg-gray-300"/>
                    </View>

                    {/* Social Login (Optional for future) */}
                    <TouchableOpacity
                        className="flex-row items-center justify-center bg-white border-2 border-gray-200 rounded-xl py-4 mb-6"
                        onPress={() => showToast.info("Currently under dev mode!", "Please login with your credentials")}
                    >
                        <Ionicons name="logo-google" size={20} color="#4285F4"/>
                        <Text className="ml-2 font-semibold text-gray-700">
                            Continue with Google
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View className="px-6 pb-12">
                    <View className="flex-row items-center justify-center">
                        <Text className="text-gray-600">Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                            <Text className="text-blue-600 font-bold">Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
import {KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View,} from 'react-native';
import {useState} from 'react';
import {router} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {StatusBar} from 'expo-status-bar';
import Input from "@/components/forms/Input";
import Button from "@/components/common/Button";
import {showToast} from "@/utils/toast";
import {useRegister} from "@/services/hooks/useAuth";
import {useTheme} from "@/components/ThemeProvider";

export default function Register() {
    const [name, setName] = useState('');
    const {actualTheme} = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const {mutate: registerUser, isPending} = useRegister();
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const validateForm = () => {
        let valid = true;
        const newErrors = {name: '', email: '', password: '', confirmPassword: ''};

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

        try {
            registerUser(
                {name, email, password},
                {
                    onSuccess: () => router.replace('/(tabs)'),
                }
            );
        } catch (error) {
            console.error('Registration error:', error);
            showToast.error(
                'Registration Failed! 😞',
                'Something went wrong. Please try again.'
            );

        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white dark:bg-slate-900"
        >
            <StatusBar style={actualTheme === 'dark' ? 'light' : 'dark'}/>
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View className="px-6 pt-16 pb-8">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full mb-6"
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={actualTheme === 'dark' ? '#f1f5f9' : '#374151'}
                        />
                    </TouchableOpacity>

                    <View className="mb-2">
                        <Text className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            Create Account 🚀
                        </Text>
                        <Text className="text-slate-600 dark:text-slate-400 text-base">
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
                            setErrors({...errors, name: ''});
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
                            setErrors({...errors, confirmPassword: ''});
                        }}
                        placeholder="Re-enter your password"
                        icon="lock-closed"
                        secureTextEntry
                        error={errors.confirmPassword}
                    />

                    {/* Terms and Conditions */}
                    <View className="flex-row items-start mb-6">
                        <Ionicons
                            name="information-circle"
                            size={16}
                            color={actualTheme === 'dark' ? '#64748b' : '#6b7280'}
                            style={{marginTop: 2, marginRight: 6}}
                        />
                        <Text className="flex-1 text-slate-600 dark:text-slate-400 text-sm">
                            By signing up, you agree to our{' '}
                            <Text className="text-blue-600 dark:text-blue-400 font-semibold">
                                Terms of Service
                            </Text>
                            {' '}and{' '}
                            <Text className="text-blue-600 dark:text-blue-400 font-semibold">
                                Privacy Policy
                            </Text>
                        </Text>
                    </View>

                    <Button
                        title="Create Account"
                        onPress={handleRegister}
                        loading={isPending}
                    />

                    {/* Divider */}
                    <View className="flex-row items-center my-6">
                        <View className="flex-1 h-px bg-slate-300 dark:bg-slate-700"/>
                        <Text className="mx-4 text-slate-500 dark:text-slate-400">or</Text>
                        <View className="flex-1 h-px bg-slate-300 dark:bg-slate-700"/>
                    </View>

                    {/* Social Sign Up */}
                    <TouchableOpacity
                        className="flex-row items-center justify-center bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl py-4 mb-6"
                        onPress={() => showToast.info("Currently under dev mode!", "Please sign up with your credentials")}
                    >
                        <Ionicons name="logo-google" size={20} color="#4285F4"/>
                        <Text className="ml-2 font-semibold text-slate-700 dark:text-slate-300">
                            Sign up with Google
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View className="px-6 mb-8">
                    <View className="flex-row items-center justify-center">
                        <Text className="text-slate-600 dark:text-slate-400">
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                            <Text className="text-blue-600 dark:text-blue-400 font-bold">
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
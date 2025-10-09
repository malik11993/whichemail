import {Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

interface ErrorScreenProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    retryLabel?: string;
    showRetry?: boolean;
}

export default function ErrorScreen({
                                        title = 'Something Went Wrong! 😥',
                                        message = 'We encountered an error while loading your service. Please try again or check your network connection.',
                                        onRetry,
                                        retryLabel = 'Try Again',
                                        showRetry = true,
                                    }: ErrorScreenProps) {
    return (
        <View className="flex-1 bg-gray-50 items-center justify-center px-6">
            {/* Error Icon */}
            <View className="items-center mb-8">
                {/* Outer Circle with Pulse Effect */}
                <View className="bg-red-100 w-32 h-32 rounded-full items-center justify-center mb-6">
                    <View className="bg-red-200 w-24 h-24 rounded-full items-center justify-center">
                        <Ionicons name="alert-circle" size={56} color="#ef4444"/>
                    </View>
                </View>

                {/* Error Code Badge (Optional) */}
                <View className="bg-red-50 px-4 py-1.5 rounded-full border border-red-200">
                    <Text className="text-red-600 font-semibold text-xs">
                        ERROR
                    </Text>
                </View>
            </View>

            {/* Error Content */}
            <View className="items-center mb-8 max-w-sm">
                <Text className="text-gray-900 font-bold text-2xl mb-3 text-center">
                    {title}
                </Text>
                <Text className="text-gray-500 text-center text-base leading-6">
                    {message}
                </Text>
            </View>

            {/* Action Buttons */}
            {showRetry && onRetry && (
                <View className="w-full max-w-sm">
                    <TouchableOpacity
                        onPress={onRetry}
                        className="bg-blue-600 py-4 px-6 rounded-2xl shadow-lg active:scale-95 mb-3"
                        activeOpacity={0.9}
                    >
                        <View className="flex-row items-center justify-center">
                            <Ionicons name="refresh" size={20} color="white"/>
                            <Text className="text-white text-center font-bold text-base ml-2">
                                {retryLabel}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Help Text */}
                    <View className="flex-row items-center justify-center mt-4">
                        <Ionicons name="information-circle-outline" size={16} color="#9ca3af"/>
                        <Text className="text-gray-400 text-xs ml-1">
                            If the problem persists, contact support
                        </Text>
                    </View>
                </View>
            )}

            {/* Decorative Elements */}
            <View className="absolute top-20 right-10 opacity-10">
                <Ionicons name="close-circle" size={80} color="#ef4444"/>
            </View>
            <View className="absolute bottom-20 left-10 opacity-10">
                <Ionicons name="warning" size={60} color="#ef4444"/>
            </View>
        </View>
    );
}
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingScreenProps {
    message?: string;
}

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
    return (
        <View className="flex-1 bg-white items-center justify-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-gray-500 mt-4">{message}</Text>
        </View>
    );
}
import {Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import Button from './Button';

interface EmptyStateProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    message: string;
    actionLabel?: string;
    onAction?: () => void;
}

export default function EmptyState({
                                       icon,
                                       title,
                                       message,
                                       actionLabel,
                                       onAction
                                   }: EmptyStateProps) {
    return (
        <View className="flex-1 items-center justify-center px-8 py-12">
            <View className="bg-blue-50 rounded-full p-6 mb-4">
                <Ionicons name={icon} size={48} color="#3b82f6"/>
            </View>
            <Text className="text-gray-900 font-bold text-xl text-center mb-2">
                {title}
            </Text>
            <Text className="text-gray-500 text-center mb-6">
                {message}
            </Text>
            {actionLabel && onAction && (
                <Button title={actionLabel} onPress={onAction}/>
            )}
        </View>
    );
}
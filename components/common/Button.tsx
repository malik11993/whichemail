import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    disabled?: boolean;
}

export default function Button({
                                   title,
                                   onPress,
                                   loading = false,
                                   variant = 'primary',
                                   disabled = false,
                               }: ButtonProps) {
    const getButtonStyle = () => {
        if (disabled || loading) {
            return 'bg-gray-300';
        }
        switch (variant) {
            case 'primary':
                return 'bg-blue-600 active:bg-blue-700';
            case 'secondary':
                return 'bg-gray-600 active:bg-gray-700';
            case 'outline':
                return 'bg-red-500 text-white border-2 border-red-500';
            default:
                return 'bg-blue-600';
        }
    };

    const getTextStyle = () => {
        if (disabled || loading) {
            return 'text-gray-500';
        }
        return variant === 'outline' ? 'text-white' : 'text-white';
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            className={`${getButtonStyle()} rounded-xl py-4 px-6 items-center justify-center shadow-sm`}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' ? '#3b82f6' : 'white'} />
            ) : (
                <Text className={`${getTextStyle()} font-bold text-base`}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}
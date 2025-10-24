import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    bgColor: string;
}

export default function StatCard({ title, value, icon, color, bgColor }: StatCardProps) {
    return (
        <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 flex-1 shadow-sm border border-slate-200 dark:border-slate-700">
            <View className="flex-row items-center justify-between mb-2">
                <View className="rounded-xl p-2" style={{ backgroundColor: bgColor }}>
                    <Ionicons name={icon} size={20} color={color} />
                </View>
            </View>
            <Text className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">{value}</Text>
            <Text className="text-gray-500 dark:text-slate-200 text-xs">{title}</Text>
        </View>
    );
}
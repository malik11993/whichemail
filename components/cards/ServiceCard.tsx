import {Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {router} from 'expo-router';
import {getCategoryById} from '@/constants/categories';

interface ServiceCardProps {
    service: Service;
}

export default function ServiceCard({service}: ServiceCardProps) {
    const category = getCategoryById(service.categoryId);

    return (
        <TouchableOpacity
            onPress={() => router.push(`/service/${service.id}`)}
            className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100 active:scale-98"
            activeOpacity={0.7}
        >
            <View className="flex-row items-center">
                {/* Category Icon */}
                <View
                    className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                    style={{backgroundColor: `${category.color}20`}}
                >
                    <Ionicons name={category.icon as any} size={24} color={category.color}/>
                </View>

                {/* Service Info */}
                <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-base mb-1">
                        {service.serviceName}
                    </Text>
                    <Text className="text-gray-500 text-sm" numberOfLines={1}>
                        {service.email}
                    </Text>
                </View>

                {/* Password Indicator & Arrow */}
                <View className="flex-row items-center">
                    {service.hasPassword && (
                        <View className="bg-blue-100 rounded-full p-1.5 mr-2">
                            <Ionicons name="lock-closed" size={14} color="#3b82f6"/>
                        </View>
                    )}
                    <Ionicons name="chevron-forward" size={20} color="#9ca3af"/>
                </View>
            </View>

            {/* Notes Preview */}
            {service.notes && (
                <View className="mt-3 pt-3 border-t border-gray-100">
                    <Text className="text-gray-600 text-xs" numberOfLines={1}>
                        {service.notes}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}
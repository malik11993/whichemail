import { View, Text } from 'react-native';
import { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

export const toastConfig = {
    // Success Toast
    success: (props: any) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#10b981',
                borderLeftWidth: 6,
                backgroundColor: '#ffffff',
                height: 70,
            }}
            contentContainerStyle={{
                paddingHorizontal: 15,
            }}
            text1Style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#1f2937',
            }}
            text2Style={{
                fontSize: 14,
                color: '#6b7280',
            }}
            renderLeadingIcon={() => (
                <View className="justify-center items-center ml-4">
                    <View className="bg-green-100 rounded-full p-2">
                        <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                    </View>
                </View>
            )}
        />
    ),

    // Error Toast
    error: (props: any) => (
        <ErrorToast
            {...props}
            style={{
                borderLeftColor: '#ef4444',
                borderLeftWidth: 6,
                backgroundColor: '#ffffff',
                height: 70,
            }}
            contentContainerStyle={{
                paddingHorizontal: 15,
            }}
            text1Style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#1f2937',
            }}
            text2Style={{
                fontSize: 14,
                color: '#6b7280',
            }}
            renderLeadingIcon={() => (
                <View className="justify-center items-center ml-4">
                    <View className="bg-red-100 rounded-full p-2">
                        <Ionicons name="close-circle" size={24} color="#ef4444" />
                    </View>
                </View>
            )}
        />
    ),

    // Info Toast
    info: (props: any) => (
        <InfoToast
            {...props}
            style={{
                borderLeftColor: '#3b82f6',
                borderLeftWidth: 6,
                backgroundColor: '#ffffff',
                height: 70,
            }}
            contentContainerStyle={{
                paddingHorizontal: 15,
            }}
            text1Style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#1f2937',
            }}
            text2Style={{
                fontSize: 14,
                color: '#6b7280',
            }}
            renderLeadingIcon={() => (
                <View className="justify-center items-center ml-4">
                    <View className="bg-blue-100 rounded-full p-2">
                        <Ionicons name="information-circle" size={24} color="#3b82f6" />
                    </View>
                </View>
            )}
        />
    ),

    // Warning Toast
    warning: (props: any) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#f59e0b',
                borderLeftWidth: 6,
                backgroundColor: '#ffffff',
                height: 70,
            }}
            contentContainerStyle={{
                paddingHorizontal: 15,
            }}
            text1Style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#1f2937',
            }}
            text2Style={{
                fontSize: 14,
                color: '#6b7280',
            }}
            renderLeadingIcon={() => (
                <View className="justify-center items-center ml-4">
                    <View className="bg-amber-100 rounded-full p-2">
                        <Ionicons name="warning" size={24} color="#f59e0b" />
                    </View>
                </View>
            )}
        />
    ),

    // Custom Toast (for special cases)
    custom: ({ text1, text2, props }: any) => (
        <View className="bg-white rounded-2xl shadow-lg mx-4 p-4 flex-row items-center border-l-4 border-blue-500">
            <View className="bg-blue-100 rounded-full p-2 mr-3">
                <Ionicons name={props.icon || 'mail'} size={24} color="#3b82f6" />
            </View>
            <View className="flex-1">
                <Text className="text-gray-900 font-bold text-base">{text1}</Text>
                {text2 && <Text className="text-gray-600 text-sm mt-1">{text2}</Text>}
            </View>
        </View>
    ),
};
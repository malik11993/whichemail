import { View, Text } from 'react-native';
import { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';


export const getToastConfig = (actualTheme: string) => ({
    // Success Toast
    success: (props: any) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#10b981',
                borderLeftWidth: 6,
                backgroundColor: actualTheme === 'dark' ? '#1e293b' : '#ffffff', // slate-800 for dark, white for light
                height: 70,
            }}
            contentContainerStyle={{
                paddingHorizontal: 15,
            }}
            text1Style={{
                fontSize: 16,
                fontWeight: '700',
                color: actualTheme === 'dark' ? '#f1f5f9' : '#0f172a', // slate-100 for dark, slate-900 for light
            }}
            text2Style={{
                fontSize: 14,
                color: actualTheme === 'dark' ? '#94a3b8' : '#64748b', // slate-400 for dark, slate-500 for light
            }}
            renderLeadingIcon={() => (
                <View className="justify-center items-center ml-4">
                    <View className={`rounded-full p-2 ${actualTheme === 'dark' ? 'bg-green-900' : 'bg-green-100'}`}>
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
                backgroundColor: actualTheme === 'dark' ? '#1e293b' : '#ffffff', // slate-800 for dark, white for light
                height: 70,
            }}
            contentContainerStyle={{
                paddingHorizontal: 15,
            }}
            text1Style={{
                fontSize: 16,
                fontWeight: '700',
                color: actualTheme === 'dark' ? '#f1f5f9' : '#0f172a', // slate-100 for dark, slate-900 for light
            }}
            text2Style={{
                fontSize: 14,
                color: actualTheme === 'dark' ? '#94a3b8' : '#64748b', // slate-400 for dark, slate-500 for light
            }}
            renderLeadingIcon={() => (
                <View className="justify-center items-center ml-4">
                    <View className={`rounded-full p-2 ${actualTheme === 'dark' ? 'bg-red-900' : 'bg-red-100'}`}>
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
                backgroundColor: actualTheme === 'dark' ? '#1e293b' : '#ffffff', // slate-800 for dark, white for light
                height: 70,
            }}
            contentContainerStyle={{
                paddingHorizontal: 15,
            }}
            text1Style={{
                fontSize: 16,
                fontWeight: '700',
                color: actualTheme === 'dark' ? '#f1f5f9' : '#0f172a', // slate-100 for dark, slate-900 for light
            }}
            text2Style={{
                fontSize: 14,
                color: actualTheme === 'dark' ? '#94a3b8' : '#64748b', // slate-400 for dark, slate-500 for light
            }}
            renderLeadingIcon={() => (
                <View className="justify-center items-center ml-4">
                    <View className={`rounded-full p-2 ${actualTheme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'}`}>
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
                backgroundColor: actualTheme === 'dark' ? '#1e293b' : '#ffffff', // slate-800 for dark, white for light
                height: 70,
            }}
            contentContainerStyle={{
                paddingHorizontal: 15,
            }}
            text1Style={{
                fontSize: 16,
                fontWeight: '700',
                color: actualTheme === 'dark' ? '#f1f5f9' : '#0f172a', // slate-100 for dark, slate-900 for light
            }}
            text2Style={{
                fontSize: 14,
                color: actualTheme === 'dark' ? '#94a3b8' : '#64748b', // slate-400 for dark, slate-500 for light
            }}
            renderLeadingIcon={() => (
                <View className="justify-center items-center ml-4">
                    <View className={`rounded-full p-2 ${actualTheme === 'dark' ? 'bg-amber-900' : 'bg-amber-100'}`}>
                        <Ionicons name="warning" size={24} color="#f59e0b" />
                    </View>
                </View>
            )}
        />
    ),

    // Custom Toast (for special cases)
    custom: ({ text1, text2, props }: any) => (
        <View className={`rounded-2xl shadow-lg mx-4 p-4 flex-row items-center border-l-4 border-blue-500 ${actualTheme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
            <View className={`rounded-full p-2 mr-3 ${actualTheme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'}`}>
                <Ionicons name={props.icon || 'mail'} size={24} color="#3b82f6" />
            </View>
            <View className="flex-1">
                <Text className={`font-bold text-base ${actualTheme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{text1}</Text>
                {text2 && <Text className={`text-sm mt-1 ${actualTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{text2}</Text>}
            </View>
        </View>
    ),
});
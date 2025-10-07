import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useState} from 'react';

interface InputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    icon?: keyof typeof Ionicons.glyphMap;
    secureTextEntry?: boolean;
    error?: string;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export default function Input({
                                  label,
                                  value,
                                  onChangeText,
                                  placeholder,
                                  icon,
                                  secureTextEntry = false,
                                  error,
                                  keyboardType = 'default',
                                  autoCapitalize = 'none',
                              }: InputProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2 text-base">{label}</Text>
            <View
                className={`flex-row items-center bg-gray-50 rounded-xl px-4 border-2 ${
                    isFocused
                        ? 'border-blue-500'
                        : error
                            ? 'border-red-500'
                            : 'border-gray-200'
                }`}
            >
                {icon && (
                    <Ionicons
                        name={icon}
                        size={20}
                        color={isFocused ? '#3b82f6' : '#9ca3af'}
                        style={{marginRight: 10}}
                    />
                )}
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="flex-1 py-4 text-gray-900 text-base"
                />
                {secureTextEntry && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                        <Ionicons
                            name={isPasswordVisible ? 'eye-off' : 'eye'}
                            size={20}
                            color="#9ca3af"
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && (
                <View className="flex-row items-center mt-2">
                    <Ionicons name="alert-circle" size={16} color="#ef4444"/>
                    <Text className="text-red-500 text-sm ml-1">{error}</Text>
                </View>
            )}
        </View>
    );
}
import {TextInput, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useState} from 'react';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export default function SearchBar({
                                      value,
                                      onChangeText,
                                      placeholder = 'Search services or emails...'
                                  }: SearchBarProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View
            className={`flex-row items-center bg-gray-50 rounded-xl px-4 border-2 ${
                isFocused ? 'border-blue-500' : 'border-gray-100'
            }`}
        >
            <Ionicons
                name="search"
                size={20}
                color={isFocused ? '#3b82f6' : '#9ca3af'}
            />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#9ca3af"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="flex-1 py-3 px-3 text-gray-900 text-base"
            />
            {value.length > 0 && (
                <TouchableOpacity onPress={() => onChangeText('')}>
                    <Ionicons name="close-circle" size={20} color="#9ca3af"/>
                </TouchableOpacity>
            )}
        </View>
    );
}
import {TextInput, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useState} from 'react';
import {useTheme} from '@/components/ThemeProvider';

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
    const { actualTheme } = useTheme();

    return (
        <View
            className={`flex-row items-center rounded-xl px-4 border-2 bg-slate-50 dark:bg-slate-800 ${
                isFocused ? 'border-blue-500' : 'border-slate-200 dark:border-slate-700'
            }`}
        >
            <Ionicons
                name="search"
                size={20}
                color={isFocused ? '#3b82f6' : (actualTheme === 'dark' ? '#94a3b8' : '#9ca3af')}
            />
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={actualTheme === 'dark' ? '#94a3b8' : '#9ca3af'}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="flex-1 py-3 px-3 text-slate-900 dark:text-slate-100 text-base"
            />
            {value.length > 0 && (
                <TouchableOpacity onPress={() => onChangeText('')}>
                    <Ionicons name="close-circle" size={20} color={actualTheme === 'dark' ? '#94a3b8' : '#9ca3af'}/>
                </TouchableOpacity>
            )}
        </View>
    );
}
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useTheme} from './ThemeProvider';

export const ThemeToggle = () => {
    const {theme, actualTheme, setTheme} = useTheme();

    const themeOptions = [
        {value: 'light' as const, label: 'Light', icon: 'sunny'},
        {value: 'dark' as const, label: 'Dark', icon: 'moon'},
        {value: 'system' as const, label: 'System', icon: 'phone-portrait'},
    ];

    const iconColor = actualTheme === 'dark' ? '#cbd5e1' : '#475569';

    return (
        <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
            <View className="flex-row items-center mb-3">
                <Ionicons name="color-palette" size={20} color={iconColor}/>
                <Text className="text-slate-900 dark:text-slate-100 font-semibold text-base ml-2">
                    Theme
                </Text>
            </View>

            <View className="flex-row gap-3">
                {themeOptions.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        onPress={() => setTheme(option.value)}
                        className={`flex-1 p-3 rounded-xl border-2 items-center ${
                            theme === option.value
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                                : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                        }`}
                    >
                        <Ionicons
                            name={option.icon as any}
                            size={24}
                            color={theme === option.value ? '#3b82f6' : iconColor}
                        />
                        <Text
                            className={`text-xs font-semibold mt-1 ${
                                theme === option.value
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 dark:text-slate-400'
                            }`}
                        >
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {theme === 'system' && (
                <Text className="text-slate-500 dark:text-slate-400 text-xs mt-2 text-center">
                    Currently using: {actualTheme === 'dark' ? 'Dark' : 'Light'} mode
                </Text>
            )}
        </View>
    );
};
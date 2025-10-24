import {Tabs} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';

export default function TabsLayout() {
    const { actualTheme } = useTheme();
    const isDark = actualTheme === 'dark';
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#3b82f6', // Blue primary color
                tabBarInactiveTintColor: isDark ? '#94a3b8' : '#64748b', // Slate for inactive
                tabBarStyle: {
                    backgroundColor: isDark ? '#1e293b' : '#ffffff', // slate-800 : white
                    borderTopColor: isDark ? '#334155' : '#e2e8f0', // slate-700 : slate-200
                    borderTopWidth: 1,
                    paddingBottom: 5
                },
                tabBarLabelStyle: {
                    fontSize: 13,
                    fontWeight: '600',
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="home" size={size} color={color}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="services"
                options={{
                    title: 'Services',
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="mail" size={size} color={color}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="ai-assistant"
                options={{
                    title: 'AI Assistant',
                    tabBarIcon: ({color, size}) => (
                      <Ionicons name="sparkles" size={size} color={color}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="settings" size={size} color={color}/>
                    ),
                }}
            />
        </Tabs>
    );
}
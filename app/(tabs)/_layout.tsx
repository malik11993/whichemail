import {Tabs} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {View, Platform} from 'react-native';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#3b82f6',
                tabBarInactiveTintColor: '#9ca3af',
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#f3f4f6',
                    height: Platform.OS === 'ios' ? 88 : 68,
                    paddingTop: 8,
                    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
                    paddingHorizontal: 16,
                    elevation: 0,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: -2,
                    },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: 4,
                },
                tabBarItemStyle: {
                    paddingVertical: 4,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({color, focused}) => (
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 48,
                                height: 48,
                            }}
                        >
                            {focused && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        width: 48,
                                        height: 48,
                                        backgroundColor: '#dbeafe',
                                        borderRadius: 16,
                                    }}
                                />
                            )}
                            <Ionicons
                                name={focused ? 'home' : 'home-outline'}
                                size={24}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="services"
                options={{
                    title: 'Services',
                    tabBarIcon: ({color, focused}) => (
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 48,
                                height: 48,
                            }}
                        >
                            {focused && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        width: 48,
                                        height: 48,
                                        backgroundColor: '#dbeafe',
                                        borderRadius: 16,
                                    }}
                                />
                            )}
                            <Ionicons
                                name={focused ? 'mail' : 'mail-outline'}
                                size={24}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({color, focused}) => (
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 48,
                                height: 48,
                            }}
                        >
                            {focused && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        width: 48,
                                        height: 48,
                                        backgroundColor: '#dbeafe',
                                        borderRadius: 16,
                                    }}
                                />
                            )}
                            <Ionicons
                                name={focused ? 'settings' : 'settings-outline'}
                                size={24}
                                color={color}
                            />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}
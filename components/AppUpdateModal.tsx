import React from "react";
import {ActivityIndicator, Text, TouchableOpacity, View} from "react-native";
import Modal from "react-native-modal";
import {Ionicons} from "@expo/vector-icons";
import {showToast} from "@/utils/toast";

interface Props {
    visible: boolean;
    isDownloading: boolean;
    onReload: () => void;
}

export const AppUpdateModal = ({visible, isDownloading, onReload}: Props) => {
    return (
        <Modal
            isVisible={visible}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropTransitionOutTiming={0}
            backdropOpacity={0.5}
            useNativeDriver
        >
            <View className="bg-white rounded-3xl p-8 mx-4 shadow-2xl">
                {/* Icon Header */}
                <View className="items-center mb-6">
                    <View className="bg-gradient-to-r from-blue-100 to-indigo-100 w-20 h-20 rounded-full items-center justify-center mb-4">
                        <Ionicons name="rocket" size={40} color="#3b82f6" />
                    </View>

                    <Text className="text-2xl font-bold text-gray-900 mb-2">
                        New Update Available! 🚀
                    </Text>

                    <View className="bg-blue-50 px-4 py-1.5 rounded-full">
                        <Text className="text-blue-600 font-semibold text-xs">
                            Version 2.0 Ready
                        </Text>
                    </View>
                </View>

                {/* Content */}
                <View className="mb-6">
                    <Text className="text-gray-700 text-center text-base mb-4 leading-6">
                        We've been working hard to bring you the best experience!
                        This update includes exciting new features, performance improvements,
                        and important bug fixes.
                    </Text>

                    {/* Feature List */}
                    <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                        <Text className="text-gray-900 font-semibold mb-3 text-sm">
                            What's New:
                        </Text>
                        <View className="space-y-2">
                            <View className="flex-row items-center mb-2">
                                <View className="bg-green-100 w-6 h-6 rounded-full items-center justify-center mr-3">
                                    <Ionicons name="checkmark" size={14} color="#10b981" />
                                </View>
                                <Text className="text-gray-600 text-sm flex-1">
                                    Enhanced performance & speed
                                </Text>
                            </View>
                            <View className="flex-row items-center mb-2">
                                <View className="bg-green-100 w-6 h-6 rounded-full items-center justify-center mr-3">
                                    <Ionicons name="checkmark" size={14} color="#10b981" />
                                </View>
                                <Text className="text-gray-600 text-sm flex-1">
                                    Critical bug fixes
                                </Text>
                            </View>
                            <View className="flex-row items-center">
                                <View className="bg-green-100 w-6 h-6 rounded-full items-center justify-center mr-3">
                                    <Ionicons name="checkmark" size={14} color="#10b981" />
                                </View>
                                <Text className="text-gray-600 text-sm flex-1">
                                    Improved user experience
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Text className="text-gray-500 text-center text-xs">
                        The update will take just a moment. Your data is safe and secure.
                    </Text>
                </View>

                {/* Action Button */}
                {isDownloading ? (
                    <View className="bg-blue-50 py-4 px-6 rounded-2xl items-center">
                        <ActivityIndicator size="large" color="#3b82f6" className="mb-3"/>
                        <Text className="text-blue-600 font-semibold">
                            Updating Your App...
                        </Text>
                        <Text className="text-gray-500 text-xs mt-1">
                            Please wait while we apply the latest changes
                        </Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={() => {
                            showToast.success("Updating...", "Reloading the latest version");
                            onReload();
                        }}
                        className="bg-blue-600 py-4 px-6 rounded-2xl shadow-lg active:scale-95"
                        activeOpacity={0.9}
                    >
                        <View className="flex-row items-center justify-center">
                            <Ionicons name="refresh" size={20} color="white" className="mr-2" />
                            <Text className="text-white text-center font-bold text-base ml-2">
                                Update Now
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}

                {/* Progress Indicator */}
                {!isDownloading && (
                    <Text className="text-gray-400 text-center text-xs mt-4">
                        Takes less than 5 seconds ⚡
                    </Text>
                )}
            </View>
        </Modal>
    );
};
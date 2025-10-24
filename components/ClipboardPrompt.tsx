import React, {useState} from "react";
import {Modal, Text, TextInput, TouchableOpacity, View,} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useCreateService} from "@/services/queries/serviceQueries";
import {ClipboardDetection} from "@/hooks/useClipboardMonitor";
import {showToast} from "@/utils/toast";
import {router} from "expo-router";
import {useTheme} from "@/components/ThemeProvider";

interface ClipboardPromptProps {
    detection: ClipboardDetection | null;
    onDismiss: () => void;
    isAuthenticated: boolean;
}

export const ClipboardPrompt: React.FC<ClipboardPromptProps> = ({
                                                                    detection,
                                                                    onDismiss,
                                                                    isAuthenticated,
                                                                }) => {
    const [serviceName, setServiceName] = useState("");
    const [showFullForm, setShowFullForm] = useState(false);
    const createService = useCreateService();
    const {actualTheme} = useTheme();

    const handleAuthRequired = () => {
        showToast.error("Login Required", "Please login first to save your emails 🔐");
        onDismiss();
        router.push("/(auth)/login");
    };

    const handleQuickSave = () => {
        if (!isAuthenticated) {
            handleAuthRequired();
            return;
        }

        if (!detection) return;

        // Try to extract service name from clipboard text or use email domain
        const domain = detection.email.split("@")[1]?.split(".")[0] || "Unknown";
        const autoServiceName = domain.charAt(0).toUpperCase() + domain.slice(1);

        createService.mutate(
            {
                serviceName: autoServiceName,
                email: detection.email,
                categoryId: "",
                hasPassword: false,
            },
            {
                onSuccess: () => {
                    onDismiss();
                    setServiceName("");
                },
            }
        );
    };

    const handleCustomSave = () => {
        if (!isAuthenticated) {
            handleAuthRequired();
            return;
        }

        if (!detection || !serviceName.trim()) return;

        createService.mutate(
            {
                serviceName: serviceName.trim(),
                email: detection.email,
                categoryId: "",
                hasPassword: false,
            },
            {
                onSuccess: () => {
                    onDismiss();
                    setServiceName("");
                    setShowFullForm(false);
                },
            }
        );
    };

    if (!detection) return null;

    return (
        <Modal
            visible={!!detection}
            transparent
            animationType="slide"
            onRequestClose={onDismiss}
        >
            <View className="flex-1 justify-end bg-black/50">
                <View className="bg-white dark:bg-slate-800 rounded-t-3xl p-6 pb-10">
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center gap-2">
                            <View
                                className="bg-blue-500 dark:bg-blue-600 w-10 h-10 rounded-full items-center justify-center">
                                <Ionicons name="mail" size={20} color="#fff"/>
                            </View>
                            <Text className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                Email Detected! 📧
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onDismiss}>
                            <Ionicons name="close" size={24} color={actualTheme === 'dark' ? '#94a3b8' : '#64748b'}/>
                        </TouchableOpacity>
                    </View>

                    {/* Email Display */}
                    <View
                        className="bg-blue-50 dark:bg-slate-700 p-4 rounded-xl mb-4 border border-blue-200 dark:border-slate-600">
                        <Text className="text-xs text-slate-500 dark:text-slate-400 mb-1">Copied Email:</Text>
                        <Text className="text-base font-semibold text-blue-600 dark:text-blue-400">
                            {detection.email}
                        </Text>
                    </View>

                    {!showFullForm ? (
                        <>
                            {/* Quick Actions */}
                            <Text className="text-sm text-slate-600 dark:text-slate-300 mb-3">
                                Save this email to WhichEmail?
                            </Text>

                            <TouchableOpacity
                                className="bg-blue-500 dark:bg-blue-600 p-4 rounded-xl mb-3 flex-row items-center justify-center gap-2"
                                onPress={handleQuickSave}
                                disabled={createService.isPending}
                            >
                                <Ionicons name="flash" size={20} color="#fff"/>
                                <Text className="text-white font-semibold text-base">
                                    {createService.isPending ? "Saving..." : "Quick Save"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="bg-slate-100 dark:bg-slate-700 p-4 rounded-xl flex-row items-center justify-center gap-2"
                                onPress={() => setShowFullForm(true)}
                            >
                                <Ionicons name="create-outline" size={20}
                                          color={actualTheme === 'dark' ? '#cbd5e1' : '#475569'}/>
                                <Text className="text-slate-700 dark:text-slate-300 font-semibold text-base">
                                    Add Service Name
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            {/* Custom Form */}
                            <Text className="text-sm text-slate-600 dark:text-slate-300 mb-2">Service Name:</Text>
                            <TextInput
                                className="bg-slate-50 dark:bg-slate-700 p-4 rounded-xl text-base mb-4 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100"
                                placeholder="e.g., Netflix, Gmail, Amazon"
                                placeholderTextColor={actualTheme === 'dark' ? '#94a3b8' : '#64748b'}
                                value={serviceName}
                                onChangeText={setServiceName}
                                autoFocus
                                returnKeyType="done"
                                onSubmitEditing={handleCustomSave}
                            />

                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    className="flex-1 bg-slate-100 dark:bg-slate-700 p-4 rounded-xl"
                                    onPress={() => {
                                        setShowFullForm(false);
                                        setServiceName("");
                                    }}
                                >
                                    <Text className="text-slate-700 dark:text-slate-300 font-semibold text-center">
                                        Back
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className={`flex-1 p-4 rounded-xl ${
                                        serviceName.trim()
                                            ? "bg-blue-500 dark:bg-blue-600"
                                            : "bg-slate-300 dark:bg-slate-600"
                                    }`}
                                    onPress={handleCustomSave}
                                    disabled={!serviceName.trim() || createService.isPending}
                                >
                                    <Text className="text-white font-semibold text-center">
                                        {createService.isPending ? "Saving..." : "Save"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}

                    {/* Dismiss Text */}
                    <TouchableOpacity className="mt-4" onPress={onDismiss}>
                        <Text className="text-center text-sm text-slate-400 dark:text-slate-500">
                            Not now
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>

    );
};
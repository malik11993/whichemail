import React, {useState} from "react";
import {Modal, Text, TextInput, TouchableOpacity, View,} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useCreateService} from "@/services/queries/serviceQueries";
import {ClipboardDetection} from "@/hooks/useClipboardMonitor";
import {showToast} from "@/utils/toast";
import {router} from "expo-router";

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
                <View className="bg-white rounded-t-3xl p-6 pb-10">
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center gap-2">
                            <View className="bg-blue-500 w-10 h-10 rounded-full items-center justify-center">
                                <Ionicons name="mail" size={20} color="#fff"/>
                            </View>
                            <Text className="text-lg font-bold text-slate-800">
                                Email Detected! 📧
                            </Text>
                        </View>
                        <TouchableOpacity onPress={onDismiss}>
                            <Ionicons name="close" size={24} color="#64748b"/>
                        </TouchableOpacity>
                    </View>

                    {/* Email Display */}
                    <View className="bg-blue-50 p-4 rounded-xl mb-4 border border-blue-200">
                        <Text className="text-xs text-slate-500 mb-1">Copied Email:</Text>
                        <Text className="text-base font-semibold text-blue-600">
                            {detection.email}
                        </Text>
                    </View>

                    {!showFullForm ? (
                        <>
                            {/* Quick Actions */}
                            <Text className="text-sm text-slate-600 mb-3">
                                Save this email to WhichEmail?
                            </Text>

                            <TouchableOpacity
                                className="bg-blue-500 p-4 rounded-xl mb-3 flex-row items-center justify-center gap-2"
                                onPress={handleQuickSave}
                                disabled={createService.isPending}
                            >
                                <Ionicons name="flash" size={20} color="#fff"/>
                                <Text className="text-white font-semibold text-base">
                                    {createService.isPending ? "Saving..." : "Quick Save"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="bg-slate-100 p-4 rounded-xl flex-row items-center justify-center gap-2"
                                onPress={() => setShowFullForm(true)}
                            >
                                <Ionicons name="create-outline" size={20} color="#475569"/>
                                <Text className="text-slate-700 font-semibold text-base">
                                    Add Service Name
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            {/* Custom Form */}
                            <Text className="text-sm text-slate-600 mb-2">Service Name:</Text>
                            <TextInput
                                className="bg-slate-50 p-4 rounded-xl text-base mb-4 border border-slate-200"
                                placeholder="e.g., Netflix, Gmail, Amazon"
                                value={serviceName}
                                onChangeText={setServiceName}
                                autoFocus
                                returnKeyType="done"
                                onSubmitEditing={handleCustomSave}
                            />

                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    className="flex-1 bg-slate-100 p-4 rounded-xl"
                                    onPress={() => {
                                        setShowFullForm(false);
                                        setServiceName("");
                                    }}
                                >
                                    <Text className="text-slate-700 font-semibold text-center">
                                        Back
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className={`flex-1 p-4 rounded-xl ${
                                        serviceName.trim()
                                            ? "bg-blue-500"
                                            : "bg-slate-300"
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
                        <Text className="text-center text-sm text-slate-400">
                            Not now
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
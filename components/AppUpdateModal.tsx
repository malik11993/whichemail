import React from "react";
import {ActivityIndicator, Text, TouchableOpacity, View} from "react-native";
import Modal from "react-native-modal";
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
            backdropOpacity={0.4}
            useNativeDriver
        >
            <View className="bg-white rounded-3xl p-6 mx-4 shadow-2xl items-center">
                <Text className="text-xl font-bold text-blue-600 mb-2">
                    New Update Available 🚀
                </Text>

                <Text className="text-gray-600 text-center mb-4">
                    We’ve made some improvements and fixed a few bugs.
                    Tap below to reload and get the latest version.
                </Text>

                {isDownloading ? (
                    <ActivityIndicator size="large" color="#3b82f6"/>
                ) : (
                    <TouchableOpacity
                        onPress={() => {
                            showToast.success("Updating...", "Reloading the latest version");
                            onReload();
                        }}
                        className="bg-blue-600 py-3 px-6 rounded-xl w-full"
                    >
                        <Text className="text-white text-center font-semibold">
                            Reload App
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </Modal>
    );
};

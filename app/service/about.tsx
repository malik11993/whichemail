import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {useRouter} from "expo-router";

const AboutWhichEmail = () => {
    const router = useRouter();

    return (
        <ScrollView className="flex-1 bg-blue-100 dark:bg-slate-800 px-6 py-10">
            {/* App Logo */}
            <View className="items-center mb-8">
                <Image
                    source={require("@/assets/images/logo_v2.png")}
                    className="w-24 h-24 mb-3"
                    resizeMode="contain"
                />
                <Text className="text-blue-600 font-extrabold text-2xl">
                    WhichEmail
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                    Smarter way to manage your email accounts
                </Text>
            </View>

            {/* About Section */}
            <View className="space-y-4">
                <Text className="text-lg font-semibold text-gray-800 mb-1">
                    About WhichEmail
                </Text>
                <Text className="text-gray-600 dark:text-slate-100 dark:italic leading-6">
                    WhichEmail helps you track, organize, and manage all your online
                    accounts and the emails linked to them — securely and efficiently.
                    No more guessing “Which email did I use?” when signing into your
                    favorite apps or services.
                </Text>

                <Text className="text-gray-600 dark:text-slate-100 dark:italic leading-6">
                    With simple search, smart categories, and password-tracking features,
                    you can manage your online presence with ease. We prioritize your
                    security and privacy while giving you full control over your
                    information.
                </Text>
            </View>

            {/* Mission Section */}
            <View className="mt-8 space-y-3">
                <Text className="text-lg font-semibold text-gray-800">
                    Our Mission
                </Text>
                <Text className="text-gray-600 dark:text-slate-100 dark:italic leading-6">
                    Our mission is to simplify digital identity management for everyone.
                    Whether you have 3 or 30 online accounts, WhichEmail ensures that you
                    never lose track of which email or password goes where.
                </Text>
            </View>

            {/* Footer / CTA */}
            <View className="mt-10 items-center">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="bg-blue-600 px-6 py-3 rounded-2xl active:scale-95"
                >
                    <Text className="text-white font-semibold text-base">Go Back</Text>
                </TouchableOpacity>
            </View>

            <Text className="text-center text-gray-400 dark:text-slate-100 dark:italic text-xs mt-8">
                © {new Date().getFullYear()} WhichEmail. Built with 💙 by Fanyi Charllson - CharlseEmpire Tech.
            </Text>
        </ScrollView>
    );
};

export default AboutWhichEmail;

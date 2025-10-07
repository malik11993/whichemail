import {Ionicons} from "@expo/vector-icons";
import {Text, View} from "react-native";

export function FeatureCard({icon, title, description}: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
}) {
    return (
        <View className="bg-white/10 backdrop-blur rounded-2xl p-5 flex-row items-start border border-white/20">
            <View className="bg-white/20 rounded-full p-3 mr-4">
                <Ionicons name={icon} size={26} color="white"/>
            </View>
            <View className="flex-1 pt-1">
                <Text className="text-white font-bold text-lg mb-1">
                    {title}
                </Text>
                <Text className="text-blue-50 text-sm leading-5">
                    {description}
                </Text>
            </View>
        </View>
    );
}
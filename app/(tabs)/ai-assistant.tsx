import React, {useState} from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useServices} from "@/services/queries/serviceQueries";
import {useAIChat, useEmailRecovery, useSmartSearch,} from "@/services/hooks/geminiQueries";
import {router} from "expo-router";

type Mode = "smart-search" | "recovery" | "chat";

export default function AIAssistantScreen() {
    const [mode, setMode] = useState<Mode>("smart-search");
    const [input, setInput] = useState("");
    const [chatHistory, setChatHistory] = useState<
        { role: "user" | "ai"; text: string }[]
    >([]);

    const {data: services = []} = useServices();
    const smartSearch = useSmartSearch();
    const emailRecovery = useEmailRecovery();
    const aiChat = useAIChat();

    const handleSmartSearch = () => {
        if (!input.trim()) return;
        smartSearch.mutate(
            {query: input, services},
            {
                onSuccess: (data) => {
                    setChatHistory((prev) => [
                        ...prev,
                        {role: "user", text: input},
                        {
                            role: "ai",
                            text:
                                data.results.length > 0
                                    ? `Found ${data.results.length} match(es)! 🎯`
                                    : "No matches found. Try rephrasing your query. 🤔",
                        },
                    ]);
                    setInput("");
                },
            }
        );
    };

    const handleRecovery = () => {
        if (!input.trim()) return;
        emailRecovery.mutate(
            {context: input, services},
            {
                onSuccess: (data) => {
                    setChatHistory((prev) => [
                        ...prev,
                        {role: "user", text: input},
                        {
                            role: "ai",
                            text: `${data.reasoning}\n\n${
                                data.matchedServices.length > 0
                                    ? `Suggested: ${data.matchedServices
                                        .map((s) => s.serviceName)
                                        .join(", ")}`
                                    : "No matches found based on your description."
                            }`,
                        },
                    ]);
                    setInput("");
                },
            }
        );
    };

    const handleChat = () => {
        if (!input.trim()) return;
        const userMessage = input;
        setChatHistory((prev) => [...prev, {role: "user", text: userMessage}]);
        setInput("");

        aiChat.mutate(
            {message: userMessage, services},
            {
                onSuccess: (response) => {
                    setChatHistory((prev) => [...prev, {role: "ai", text: response}]);
                },
            }
        );
    };

    const handleSubmit = () => {
        if (mode === "smart-search") handleSmartSearch();
        else if (mode === "recovery") handleRecovery();
        else handleChat();
    };

    const isLoading =
        smartSearch.isPending || emailRecovery.isPending || aiChat.isPending;

    const getPlaceholder = () => {
        switch (mode) {
            case "smart-search":
                return 'Try: "which email for shopping apps?"';
            case "recovery":
                return 'e.g., "I made this account in 2019 for gaming"';
            case "chat":
                return "Ask me anything about your emails...";
        }
    };

    const getModeIcon = (m: Mode) => {
        switch (m) {
            case "smart-search":
                return "search";
            case "recovery":
                return "help-circle";
            case "chat":
                return "chatbubbles";
        }
    };

    const renderResults = () => {
        if (smartSearch.data?.results && smartSearch.data.results.length > 0) {
            return (
                <View className="mt-3 mb-3">
                    <Text className="text-base font-semibold text-slate-800 mb-3">
                        📧 Found {smartSearch.data.results.length} Match(es):
                    </Text>
                    {smartSearch.data.results.map((service) => (
                        <TouchableOpacity
                            key={service.id}
                            className="bg-white p-3.5 rounded-lg mb-2.5 border border-slate-200"
                            onPress={() => {
                                router.push(`/service/${service.id}`);
                            }}
                        >
                            <View className="flex-row justify-between items-center mb-1.5">
                                <Text className="text-base font-semibold text-slate-800">{service.serviceName}</Text>
                                <Ionicons name="arrow-forward" size={18} color="#3b82f6"/>
                            </View>
                            <Text className="text-sm text-blue-500 mb-1">{service.email}</Text>
                            {service.notes && (
                                <Text className="text-xs text-slate-500 italic" numberOfLines={1}>
                                    {service.notes}
                                </Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            );
        }

        if (
            emailRecovery.data?.matchedServices &&
            emailRecovery.data.matchedServices.length > 0
        ) {
            return (
                <View className="mt-3 mb-3">
                    <Text className="text-base font-semibold text-slate-800 mb-3">💡 Suggestions:</Text>
                    {emailRecovery.data.matchedServices.map((service) => (
                        <TouchableOpacity
                            key={service.id}
                            className="bg-white p-3.5 rounded-lg mb-2.5 border border-slate-200"
                            onPress={() => router.push(`/service/${service.id}`)}
                        >
                            <View className="flex-row justify-between items-center mb-1.5">
                                <Text className="text-base font-semibold text-slate-800">{service.serviceName}</Text>
                                <Ionicons name="arrow-forward" size={18} color="#3b82f6"/>
                            </View>
                            <Text className="text-sm text-blue-500 mb-1">{service.email}</Text>
                            <Text className="text-xs text-slate-400">
                                Created: {new Date(service.createdAt).toLocaleDateString()}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            );
        }

        return null;
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-slate-50"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}
        >
            <View className="p-5 pt-16 bg-blue-500">
                <Text className="text-3xl font-bold text-white">WhichEmail AI ✨</Text>
                <Text className="text-sm text-blue-100 mt-1">Your intelligent email assistant</Text>
            </View>

            {/* Mode Selector */}
            <View className="flex-row p-3 gap-2 bg-white border-b border-slate-200">
                {(["smart-search", "recovery", "chat"] as Mode[]).map((m) => (
                    <TouchableOpacity
                        key={m}
                        className={`flex-1 flex-row items-center justify-center p-2.5 rounded-lg gap-1.5 ${
                            mode === m ? "bg-blue-500" : "bg-blue-50"
                        }`}
                        onPress={() => {
                            setMode(m);
                            setChatHistory([]);
                            smartSearch.reset();
                            emailRecovery.reset();
                        }}
                    >
                        <Ionicons
                            name={getModeIcon(m)}
                            size={20}
                            color={mode === m ? "#fff" : "#3b82f6"}
                        />
                        <Text className={`text-xs font-semibold ${mode === m ? "text-white" : "text-blue-500"}`}>
                            {m === "smart-search"
                                ? "Search"
                                : m === "recovery"
                                    ? "Recovery"
                                    : "Chat"}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Chat History */}
            <ScrollView className="flex-1 p-4" contentContainerStyle={{
                paddingBottom: 25
            }}>
                {services.length === 0 && (
                    <View className="flex-1 justify-center items-center py-16">
                        <Ionicons name="mail-outline" size={64} color="#cbd5e1"/>
                        <Text className="text-base text-slate-500 text-center mt-4 leading-6">
                            No services saved yet!{"\n"}Add some services first to use AI features.
                        </Text>
                        <TouchableOpacity
                            className="mt-5 bg-blue-500 px-6 py-3 rounded-lg"
                            onPress={() => router.push("/services")}
                        >
                            <Text className="text-white text-sm font-semibold">Go to Services</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Welcome Message - Only shows when no chat history */}
                {services.length > 0 && chatHistory.length === 0 && !isLoading && (
                    <View className="flex-1 justify-center items-center py-12 px-6">
                        <View className="bg-blue-500 w-20 h-20 rounded-full items-center justify-center mb-4">
                            <Ionicons name="sparkles" size={40} color="#fff"/>
                        </View>
                        <Text className="text-2xl font-bold text-slate-800 mb-2">
                            Hey there! 👋
                        </Text>
                        <Text className="text-base text-slate-600 text-center leading-6 mb-1">
                            I'm your WhichEmail AI Assistant, built by{" "}
                            <Text className="font-semibold text-blue-500">Fanyi Charllson</Text> 😎
                        </Text>
                        <Text className="text-sm text-slate-500 text-center leading-5 mt-3">
                            I can help you find emails using natural language, recover forgotten accounts,
                            or just chat about your saved credentials.
                        </Text>
                        <Text className="text-sm text-slate-400 text-center mt-4 italic">
                            Choose a mode above and start typing! ✨
                        </Text>
                    </View>
                )}

                {chatHistory.map((msg, idx) => (
                    <View
                        key={idx}
                        className={`max-w-[80%] p-3 rounded-xl mb-3 ${
                            msg.role === "user"
                                ? "self-end bg-blue-500"
                                : "self-start bg-white border border-slate-200"
                        }`}
                    >
                        <Text className={`text-sm leading-5 ${msg.role === "user" ? "text-white" : "text-slate-800"}`}>
                            {msg.text}
                        </Text>
                    </View>
                ))}

                {renderResults()}

                {isLoading && (
                    <View className="flex-row items-center gap-2.5 p-4">
                        <ActivityIndicator size="small" color="#3b82f6"/>
                        <Text className="text-slate-500 text-sm">AI is thinking...</Text>
                    </View>
                )}
            </ScrollView>

            {/* Input Area */}
            {services.length > 0 && (
                <View className="flex-row p-3 bg-white border-t border-slate-200 gap-2.5">
                    <TextInput
                        className="flex-1 bg-slate-100 rounded-3xl px-4 py-2.5 text-sm max-h-24"
                        value={input}
                        onChangeText={setInput}
                        placeholder={getPlaceholder()}
                        placeholderTextColor="#94a3b8"
                        multiline
                        maxLength={500}
                        onSubmitEditing={handleSubmit}
                    />
                    <TouchableOpacity
                        className={`w-11 h-11 rounded-full justify-center items-center ${
                            !input.trim() ? "bg-slate-300" : "bg-blue-500"
                        }`}
                        onPress={handleSubmit}
                        disabled={!input.trim() || isLoading}
                    >
                        <Ionicons name="send" size={20} color="#fff"/>
                    </TouchableOpacity>
                </View>
            )}
        </KeyboardAvoidingView>
    );
}
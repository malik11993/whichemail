
interface GeminiMessage {
    role: "user" | "model";
    parts: { text: string }[];
}

interface GeminiResponse {
    candidates: {
        content: {
            parts: { text: string }[];
        };
    }[];
}

interface SmartSearchParams {
    query: string;
    services: Service[];
}
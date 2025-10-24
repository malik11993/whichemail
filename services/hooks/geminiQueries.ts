import {geminiConfig} from "@/utils/expoContants";
import {useMutation} from "@tanstack/react-query";
import {showToast} from "@/utils/toast";


const callGeminiAPI = async (prompt: string, systemInstruction: string): Promise<string> => {
    if (!geminiConfig.GEMINI_API_KEY) {
        throw new Error("Gemini API key not configured");
    }
    if (!geminiConfig.GEMINI_API_URL) {
        throw new Error("Gemini API URL not configured");
    }
    try {
        const response = await fetch(`${geminiConfig.GEMINI_API_URL}?key=${geminiConfig.GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                system_instruction: systemInstruction
                    ? {
                        parts: [{text: systemInstruction}],
                    }
                    : undefined,
                contents: [
                    {
                        role: "user",
                        parts: [{text: prompt}],
                    },
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                },
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error?.error?.message || "Gemini API request failed");
        }

        const data: GeminiResponse = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error("No response from Gemini");
        }

        return text.trim();
    } catch (e: any) {
        console.error("Gemini API Error:", e);
        throw e;
    }
}

// ---------- SMART SEARCH ----------
export const useSmartSearch = () => {
    return useMutation({
        mutationFn: async ({query, services}: SmartSearchParams) => {
            if (services.length === 0) {
                throw new Error("No services found. Add some services first!");
            }

            // Build context for AI
            const servicesContext = services
                .map(
                    (s, idx) =>
                        `${idx + 1}. Service: ${s.serviceName}, Email: ${s.email}${
                            s.categoryId ? `, Category: ${s.categoryId}` : ""
                        }${s.notes ? `, Notes: ${s.notes}` : ""}`
                )
                .join("\n");

            const systemInstruction = `You are an intelligent assistant helping users find their email credentials.
The user has saved the following services:

${servicesContext}

Your task: Based on the user's natural language query, identify which service(s) they're looking for.
Return ONLY a JSON array of service numbers (1-indexed) that match. If no match, return empty array.
Example response: [1, 3] or []

Be smart about synonyms:
- "shopping app" could match "Amazon", "eBay", "Shopify"
- "social media" could match "Facebook", "Twitter", "Instagram"
- "streaming" could match "Netflix", "Spotify", "YouTube"
- "work email" could match services with work-related keywords`;

            const response = await callGeminiAPI(query, systemInstruction);

            // Parse AI response
            let matchedIndices: number[] = [];
            try {
                // Extract JSON from response (AI might add extra text)
                const jsonMatch = response.match(/\[[\d,\s]*\]/);
                if (jsonMatch) {
                    matchedIndices = JSON.parse(jsonMatch[0]);
                }
            } catch (e) {
                console.warn("Failed to parse AI response, returning empty:", e);
            }

            // Convert indices to actual services
            const results = matchedIndices
                .map((idx) => services[idx - 1])
                .filter(Boolean);

            return {
                query,
                results,
                aiResponse: response,
            };
        },
        onError: (error: any) => {
            showToast.error(
                "AI Search Failed",
                error?.message || "Please try again or use regular search"
            );
        },
    });
};

// ---------- EMAIL RECOVERY ASSISTANT ----------

export interface RecoveryParams {
    context: string;
    services: Service[];
}

export const useEmailRecovery = () => {
    return useMutation({
        mutationFn: async ({context, services}: RecoveryParams) => {
            if (services.length === 0) {
                throw new Error("No services saved yet. Add some services first!");
            }

            const servicesContext = services
                .map(
                    (s, idx) =>
                        `${idx + 1}. Service: ${s.serviceName}, Email: ${s.email}, Created: ${new Date(
                            s.createdAt
                        ).toLocaleDateString()}${s.notes ? `, Notes: ${s.notes}` : ""}`
                )
                .join("\n");

            const systemInstruction = `You are helping a user remember which email they used for a service.

The user's saved services:
${servicesContext}

Based on the user's description/context, suggest the most likely service(s).
Consider:
- Time periods mentioned (e.g., "2019" matches services created around that time)
- Keywords (e.g., "gaming" matches gaming-related services)
- Purpose/category mentioned

Return a JSON object:
{
  "suggestions": [service numbers (1-indexed)],
  "reasoning": "Brief explanation of why these match"
}`;

            const response = await callGeminiAPI(context, systemInstruction);

            // Parse response
            let suggestions: number[] = [];
            let reasoning = "";
            try {
                // Try to extract JSON
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    suggestions = parsed.suggestions || [];
                    reasoning = parsed.reasoning || response;
                } else {
                    reasoning = response;
                }
            } catch (e) {
                reasoning = response;
            }

            const matchedServices = suggestions
                .map((idx) => services[idx - 1])
                .filter(Boolean);

            return {
                context,
                matchedServices,
                reasoning,
                allSuggestions: suggestions,
            };
        },
        onError: (error: any) => {
            showToast.error(
                "Recovery Failed",
                error?.message || "Try providing more details"
            );
        },
    });
};

// ---------- GENERAL AI ASSISTANT ----------

export const useAIChat = () => {
    return useMutation({
        mutationFn: async ({
                               message,
                               services,
                           }: {
            message: string;
            services: Service[];
        }) => {
            const servicesContext =
                services.length > 0
                    ? services
                        .map(
                            (s) =>
                                `- ${s.serviceName}: ${s.email}${
                                    s.notes ? ` (${s.notes})` : ""
                                }`
                        )
                        .join("\n")
                    : "No services saved yet.";

            const systemInstruction = `You are WhichEmail AI Assistant - a helpful assistant for managing email credentials.

User's current services:
${servicesContext}

Help the user with:
- Finding which email they used for services
- Remembering account details
- Organizing their credentials
- Answering questions about their saved data

Developer of the app is Fanyi Charllson. it was built to solve a real problem: Forgetting which email I used for different services. Now you'll never have to worry about it again!
                            
Be concise, friendly, and helpful. Use emojis sparingly.`;

            const response = await callGeminiAPI(message, systemInstruction);
            return response;
        },
        onError: (error: any) => {
            showToast.error("AI Chat Error", error?.message || "Please try again");
        },
    });
};
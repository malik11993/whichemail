import {useEffect, useRef, useState} from "react";
import * as Clipboard from "expo-clipboard";
import {AppState, AppStateStatus} from "react-native";

// Email regex pattern
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

export interface ClipboardDetection {
    email: string;
    timestamp: number;
    fullText: string;
}

interface UseClipboardMonitorOptions {
    enabled?: boolean;
    onEmailDetected?: (detection: ClipboardDetection) => void;
    checkInterval?: number; // in ms
}

export const useClipboardMonitor = ({
                                        enabled = true,
                                        onEmailDetected,
                                        checkInterval = 2000, // Check every 2 seconds
                                    }: UseClipboardMonitorOptions = {}) => {
    const [lastDetection, setLastDetection] = useState<ClipboardDetection | null>(null);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const lastCheckedContent = useRef<string>("");
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const appState = useRef(AppState.currentState);

    const checkClipboard = async () => {
        try {
            const clipboardContent = await Clipboard.getStringAsync();

            // Skip if clipboard is empty or same as last check
            if (!clipboardContent || clipboardContent === lastCheckedContent.current) {
                return;
            }

            // Update last checked content
            lastCheckedContent.current = clipboardContent;

            // Check for email in clipboard
            const emailMatches = clipboardContent.match(EMAIL_REGEX);

            if (emailMatches && emailMatches.length > 0) {
                const detection: ClipboardDetection = {
                    email: emailMatches[0], // Take first email found
                    timestamp: Date.now(),
                    fullText: clipboardContent,
                };

                setLastDetection(detection);
                onEmailDetected?.(detection);
            }
        } catch (error) {
            console.warn("Clipboard check failed:", error);
        }
    };

    const startMonitoring = () => {
        if (intervalRef.current) return; // Already monitoring

        setIsMonitoring(true);

        // Initial check
        checkClipboard();

        // Set up interval
        intervalRef.current = setInterval(checkClipboard, checkInterval);
    };

    const stopMonitoring = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsMonitoring(false);
    };

    const clearDetection = () => {
        setLastDetection(null);
    };

    // Monitor app state changes
    useEffect(() => {
        if (!enabled) return;

        const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                // App came to foreground - check clipboard immediately
                checkClipboard();
            }

            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [enabled]);

    // Start/stop monitoring based on enabled state
    useEffect(() => {
        if (enabled) {
            startMonitoring();
        } else {
            stopMonitoring();
        }

        return () => {
            stopMonitoring();
        };
    }, [enabled, checkInterval]);

    return {
        lastDetection,
        isMonitoring,
        clearDetection,
        startMonitoring,
        stopMonitoring,
    };
};
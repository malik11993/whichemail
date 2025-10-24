import React, {useState} from "react";
import {ClipboardDetection, useClipboardMonitor} from "@/hooks/useClipboardMonitor";
import {ClipboardPrompt} from "@/components/ClipboardPrompt";
import {useUser} from "@/services/hooks/userQueries";

interface ClipboardMonitorProviderProps {
    children: React.ReactNode;
}

export const ClipboardMonitorProvider: React.FC<ClipboardMonitorProviderProps> = ({
                                                                                      children,
                                                                                  }) => {
    const [currentDetection, setCurrentDetection] = useState<ClipboardDetection | null>(null);
    const {data: user} = useUser();
    const isAuthenticated = !!user;

    // Monitor clipboard regardless of auth status (to show prompts)
    // But we'll check auth when user tries to save
    const {isMonitoring} = useClipboardMonitor({
        enabled: true, // Always monitor to detect emails
        onEmailDetected: (detection) => {
            // Show prompt for everyone, but save action will check auth
            setCurrentDetection(detection);
        },
        checkInterval: 2000, // Check every 2 seconds
    });

    const handleDismiss = () => {
        setCurrentDetection(null);
    };

    return (
        <>
            {children}
            <ClipboardPrompt
                detection={currentDetection}
                onDismiss={handleDismiss}
                isAuthenticated={isAuthenticated}
            />
        </>
    );
};
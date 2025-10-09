// hooks/useAppUpdate.ts
import * as Updates from "expo-updates";
import {useEffect, useState} from "react";

export const useAppUpdate = () => {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const checkForUpdates = async () => {
            try {
                const update = await Updates.checkForUpdateAsync();
                if (update.isAvailable) {
                    setIsDownloading(true);
                    await Updates.fetchUpdateAsync();
                    setIsDownloading(false);
                    setUpdateAvailable(true);
                }
            } catch (e) {
                console.log("❌ Update check failed:", e);
            }
        };

        checkForUpdates();
    }, []);

    const reloadApp = async () => {
        await Updates.reloadAsync();
    };

    return {updateAvailable, isDownloading, reloadApp};
};

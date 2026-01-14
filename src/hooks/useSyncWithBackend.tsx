import {useEffect} from "react";
import {syncWithBackend} from "../services/sync.service.ts";
import {useOnlineStatus} from "./useOnlineStatus.ts";
import {useAuthContext} from "../context/AuthContext.tsx";

export const useSyncWithBackend = () => {
    const {isUserLoggedIn, tokenData} = useAuthContext();
    const online = useOnlineStatus();

    useEffect(() => {
        (async () => {
            if(online && isUserLoggedIn) {
                const syncWasPerformed = await syncWithBackend(tokenData.access_token);
                if (syncWasPerformed) {
                    console.log(`Synced with backend.`);
                }
            }
        })();
    }, [isUserLoggedIn, online, tokenData.access_token]);
}
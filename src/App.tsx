import {useLocationChanged} from "./hooks/useLocationChanged.ts";
import {useAccessTokenExpireTimer} from "./hooks/useAccessTokenExpireTimer.ts";
import {AppRoutes} from "./routes/AppRoutes.tsx";
import {useEffect} from "react";
import {useAppDataContext} from "./context/AppDataContext.tsx";
import {useSyncWithBackend} from "./hooks/useSyncWithBackend.tsx";
export function App() {

    // Hooks
    const { loadAllAppData } = useAppDataContext();
    useLocationChanged();
    useAccessTokenExpireTimer();

    // Runs on init and when user is logged in
    useEffect(() => {
        (async () => loadAllAppData())();
    }, [loadAllAppData]);

    // Runs when user is online and logged in
    useSyncWithBackend();

    return (
        <AppRoutes />
    );
}
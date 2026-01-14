import {useLocationChanged} from "./hooks/useLocationChanged.ts";
import {useAccessTokenExpireTimer} from "./hooks/useAccessTokenExpireTimer.ts";
import {AppRoutes} from "./routes/AppRoutes.tsx";
import {useEffect} from "react";
import {useAppDataContext} from "./context/AppDataContext.tsx";
import {useSyncWithBackend} from "./hooks/useSyncWithBackend.tsx";
import {useAuthContext} from "./context/AuthContext.tsx";
export function App() {

    const { isUserLoggedIn } = useAuthContext();
    
    // Hooks
    const { loadAllAppData } = useAppDataContext();
    useLocationChanged();
    useAccessTokenExpireTimer();
    useSyncWithBackend();

    // Runs on init and when user just logged in
    useEffect(() => {
        (async () => loadAllAppData())();
    }, [isUserLoggedIn, loadAllAppData]);


    return (
        <AppRoutes />
    );
}
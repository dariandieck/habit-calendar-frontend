import {useLocationChanged} from "./hooks/useLocationChanged.tsx";
import {useAccessTokenExpireTimer} from "./hooks/useAccessTokenExpireTimer.tsx";
import {AppRoutes} from "./routes/AppRoutes.tsx";
import {useSyncWithBackend} from "./hooks/useSyncWithBackend.tsx";
import {useLoadAllAppData} from "./hooks/useLoadAllAppData.tsx";

export function App() {

    useLocationChanged();
    useAccessTokenExpireTimer();
    useSyncWithBackend();
    useLoadAllAppData();

    return (
        <AppRoutes />
    );
}
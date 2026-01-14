import {useAuthContext} from "../context/AuthContext.tsx";
import {useAppDataContext} from "../context/AppDataContext.tsx";
import {LoginPage} from "../pages/LoginPage.tsx";
import {RouteRedirector} from "./RouteRedirector.tsx";
import {LoadingPage} from "../pages/LoadingPage.tsx";

export function AppRoutes() {
    // States
    const { isBackendAwake, isDataLoaded, isTodayDay } = useAppDataContext();
    const { isUserLoggedIn } = useAuthContext();

    // Helpers
    const isDoneLoading = isBackendAwake && isDataLoaded;
    const showLoginPage = !isUserLoggedIn && isDoneLoading;

    return (
        <>
            {
                showLoginPage && (
                    <LoginPage />
                )
            }

            {
                isDoneLoading ? (
                        <RouteRedirector isTodayDay={isTodayDay} />)
                    : (
                        <LoadingPage />
                    )
            }
        </>
    )
}
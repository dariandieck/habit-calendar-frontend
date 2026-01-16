import {useAuthContext} from "../context/AuthContext.tsx";
import {useAppDataContext} from "../context/AppDataContext.tsx";
import {LoginPage} from "../pages/LoginPage.tsx";
import {RouteRedirector} from "./RouteRedirector.tsx";
import {LoadingPage} from "../pages/LoadingPage.tsx";
export function AppRoutes() {
    // States
    const { isDataLoaded, isTodayDay } = useAppDataContext();
    const { isUserLoggedIn } = useAuthContext();

    // Helpers
    const showLoginPage = !isUserLoggedIn && isDataLoaded;

    return (
        <>
            {
                showLoginPage && (
                    <LoginPage />
                )
            }

            {
                isDataLoaded ? (
                        <RouteRedirector isTodayDay={isTodayDay} />)
                    : (
                        <LoadingPage />
                    )
            }
        </>
    )
}
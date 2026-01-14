import {useAuthContext} from "../context/AuthContext.tsx";
import {useAppDataContext} from "../context/AppDataContext.tsx";
import {LoginPage} from "../pages/LoginPage.tsx";
import {DONE_PAGE, RouteRedirector} from "./RouteRedirector.tsx";
import {LoadingPage} from "../pages/LoadingPage.tsx";
import {useLocation} from "react-router-dom";

export function AppRoutes() {
    // States
    const location = useLocation()
    const { isDataLoaded, isTodayDay } = useAppDataContext();
    const { isUserLoggedIn } = useAuthContext();

    // Helpers
    const showLoginPage = !isUserLoggedIn && isDataLoaded && location.pathname != DONE_PAGE;

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
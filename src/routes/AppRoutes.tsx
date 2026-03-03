import {useAuthContext} from "../context/AuthContext.tsx";
import {useAppDataContext} from "../context/AppDataContext.tsx";
import {LoginPage} from "../pages/LoginPage.tsx";
import {HABIT_SUMMARY_PAGE, RouteRedirector} from "./RouteRedirector.tsx";
import {LoadingPage} from "../pages/LoadingPage.tsx";
import {AddYesterdayPage} from "../pages/AddYesterdayPage.tsx";
import {useLocation} from "react-router-dom";

export function AppRoutes() {
    // States
    const { isDataLoaded, isYesterdayDay, isYesterdaysMainForm, habits } = useAppDataContext();
    const { isUserLoggedIn } = useAuthContext();
    const location = useLocation();

    // Helpers
    const showLoginPage = !isUserLoggedIn && isDataLoaded;
    const showAddYesterdayPage =
        isUserLoggedIn &&
        isDataLoaded &&
        !isYesterdayDay &&
        !isYesterdaysMainForm &&
        habits.length > 0 &&
        location.pathname !== HABIT_SUMMARY_PAGE

    return (
        <>
            {
                showLoginPage && (
                    <LoginPage />
                )
            }

            {
                showAddYesterdayPage && (
                    <AddYesterdayPage />
                )
            }

            {
                isDataLoaded ? (
                        <RouteRedirector />)
                    : (
                        <LoadingPage />
                    )
            }
        </>
    )
}
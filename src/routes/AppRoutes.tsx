import {useAuthContext} from "../context/AuthContext.tsx";
import {useAppDataContext} from "../context/AppDataContext.tsx";
import {LoginPage} from "../pages/LoginPage.tsx";
import {RouteRedirector} from "./RouteRedirector.tsx";
import {LoadingPage} from "../pages/LoadingPage.tsx";
import {AddYesterdayPage} from "../pages/AddYesterdayPage.tsx";
export function AppRoutes() {
    // States
    const { isDataLoaded, isYesterdayDay, isShowAddYesterdaysEntryPopup, isYesterdaysMainForm, habits } = useAppDataContext();
    const { isUserLoggedIn } = useAuthContext();

    // Helpers
    const showLoginPage = !isUserLoggedIn && isDataLoaded;
    const showAddYesterdayPage =
        isUserLoggedIn
        && isDataLoaded
        && !isYesterdayDay
        && isShowAddYesterdaysEntryPopup
        && !isYesterdaysMainForm
        && habits.length > 0

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
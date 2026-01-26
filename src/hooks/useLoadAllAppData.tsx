import {useEffect, useState} from "react";
import {useAppDataContext} from "../context/AppDataContext.tsx";
import {useAuthContext} from "../context/AuthContext.tsx";

export const useLoadAllAppData = () => {
    const { loadAllAppData } = useAppDataContext();
    const { isUserLoggedIn } = useAuthContext();
    const [isFirstTime, setIsFirstTime] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
            if(isFirstTime || isUserLoggedIn) {
                if(isFirstTime) setIsFirstTime(false);
                await loadAllAppData();
            }
        })();
    }, [loadAllAppData]);
}
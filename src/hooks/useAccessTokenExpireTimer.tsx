import {useEffect} from "react";
import {logUserOut} from "../utils/utils.ts";
import {useAuthContext} from "../context/AuthContext.tsx";

export const useAccessTokenExpireTimer = () => {
    const { tokenData, setTokenData } = useAuthContext();
    useEffect(() => {
        if (!tokenData.access_token || !tokenData.expire) return;

        const expiryTime = new Date(tokenData.expire).getTime();
        const currentTime = new Date().getTime();
        const delay = expiryTime - currentTime;

        if (delay <= 0) {
            console.log("Token is expired. Logging out.");
            logUserOut(setTokenData);
            return;
        }

        console.log(`Timer for access token started: Token runs out in ${Math.round(delay / 1000)} seconds.`);

        const timer = setTimeout(() => {
            console.log("Token is expired. Logging out.");
            logUserOut(setTokenData);
        }, delay);

        return () => clearTimeout(timer);

    }, [setTokenData, tokenData]);
}
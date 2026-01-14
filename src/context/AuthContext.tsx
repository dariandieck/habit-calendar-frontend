import { createContext, useContext, useState, type ReactNode } from "react";
import type { TokenData } from "../types/tokenData.ts";
import * as React from "react";

type AuthContextType = {
    tokenData: TokenData;
    setTokenData: React.Dispatch<React.SetStateAction<TokenData>>
    isUserLoggedIn: boolean;
};

const tryFetchLocalTokenData = () => {
    const localToken = localStorage.getItem("access_token");
    const localExp = localStorage.getItem("exp");
    if (localToken && localExp) {
        console.log("Got access token from local storage. It might be invalid.")
        return {access_token: localToken, success: true, expire: localExp};
    } else {
        return {access_token: "", success: false, expire: ""}
    }
}

const isJWTValid = (tokenData: TokenData) => {
    const isValid: boolean = tokenData.success && tokenData.access_token !== "" && tokenData.expire !== ""
    const expiryDate: Date = new Date(tokenData.expire);
    const now: Date = new Date();
    const isExpired: boolean = expiryDate.getTime() < now.getTime();
    return isValid && !isExpired;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [tokenData, setTokenData] = useState<TokenData>(tryFetchLocalTokenData);
    const isUserLoggedIn = isJWTValid(tokenData);
    return (
        <AuthContext.Provider value={{ tokenData, setTokenData, isUserLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

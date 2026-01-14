import type {TokenData} from "../types/tokenData.ts";
import * as React from "react";

export function getToday(): string {
    return new Date().toISOString().slice(0, 10);
}

export function logUserOut(setLoginTokenData: React.Dispatch<React.SetStateAction<TokenData>>){
    localStorage.removeItem("access_token");
    localStorage.removeItem("exp");
    setLoginTokenData({ access_token: "", success: false, expire: "" });
    console.log("Logged out.");
}
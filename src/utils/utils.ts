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

export const good_lowThresh = 95
export const good_highThresh = 100
export const bad_lowThresh = 1
export const bad_highThresh = 10
export const isGoodScore = (s: number) => s >= good_lowThresh && s <= good_highThresh
export const isBadScore = (s: number) => s >= bad_lowThresh && s <= bad_highThresh
export const isPerfectScore = (s: number) => s == good_highThresh
export const isWorstScore = (s: number) => s == bad_lowThresh
import type {TokenData} from "../types/tokenData.ts";
import * as React from "react";
import type {HeatmapDay} from "../types/heatmapDay.ts";

export function getToday(): string {
    return new Date().toISOString().slice(0, 10);
}

export function getYesterday(): string {
    return new Date(Date.now() - 86400000).toISOString().slice(0, 10);
}

export function logUserOut(setLoginTokenData: React.Dispatch<React.SetStateAction<TokenData>>){
    localStorage.removeItem("access_token");
    localStorage.removeItem("exp");
    setLoginTokenData({ access_token: "", success: false, expire: "" });
    console.log("Logged out.");
}

export function generateLast365Days(): HeatmapDay[] {
    const days: HeatmapDay[] = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        days.push({
            dateString: d.toISOString().split('T')[0],
            dayOfWeek: d.getDay() === 0 ? 6 : d.getDay() - 1, // Mo = 0, So = 6
            month: d.getMonth(),
            monthName: d.toLocaleString('de-DE', { month: 'short' }),
            dayOfMonth: d.getDate()
        });
    }
    return days;
}

export const good_lowThresh = 95
export const good_highThresh = 100
export const bad_lowThresh = 1
export const bad_highThresh = 10
export const isGoodScore = (s: number) => s >= good_lowThresh && s <= good_highThresh
export const isBadScore = (s: number) => s >= bad_lowThresh && s <= bad_highThresh
export const isPerfectScore = (s: number) => s == good_highThresh
export const isWorstScore = (s: number) => s == bad_lowThresh
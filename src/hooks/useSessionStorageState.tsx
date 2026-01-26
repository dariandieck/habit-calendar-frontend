import { useState, useEffect } from "react";
import * as React from "react";

export function useSessionStorageState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState(() => {
        const stored = sessionStorage.getItem(key);
        return stored !== null ? JSON.parse(stored) : defaultValue;
    });

    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}

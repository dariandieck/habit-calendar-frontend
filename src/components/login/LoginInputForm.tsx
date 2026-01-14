import {useRef, useState} from "react";
import type {ErrorState} from "../../types/loginErrorState.ts";
import * as React from "react";
import type {LoginData} from "../../types/loginData.ts";
import {RainbowButton} from "../ui/RainbowButton.tsx";

interface LoginInputFormProps {
    handleLogin: (e: LoginData) => void
}

export function LoginInputForm({handleLogin}: LoginInputFormProps) {
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [loginData, setLoginData] = useState<LoginData>({password: "", username: ""});
    const [errors, setErrors] = useState<ErrorState>({username: false, password: false});

    const detectErrorsInInputFields = () => {
        let anyErrors = false;
        const newErrors: ErrorState = {
            username: loginData.username.trim() === "",
            password: loginData.password.trim() === "",
        };
        if (loginData.username.trim() === "" || loginData.password.trim() === "") anyErrors = true;

        setErrors(newErrors);
        return anyErrors;
    }

    const updateLoginData = (field: "username" | "password", value: string) => {
        setLoginData(prev => ({...prev, [field]: value}));
        // Fehler-State updaten
        setErrors(prev => ({...prev, [field]: value.trim() === ""}));
    }

    const handleUsernameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Verhindere, dass das Formular schon jetzt abschickt
            passwordInputRef.current?.focus(); // Springe zum Passwort-Feld
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const anyErrors = detectErrorsInInputFields();
        if (anyErrors) {
            alert("Bitte alle Felder ausfüllen :)");
            return;
        }

        setIsSaving(true);
        setTimeout(() => {
            handleLogin(loginData);
            setIsSaving(false);
        }, 2000);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-left">
                <label className="text-xs font-bold text-purple-400 uppercase tracking-widest ml-2 mb-1 block">
                    Username
                </label>
                <input
                    type="text"
                    enterKeyHint="next"
                    value={loginData.username}
                    onKeyDown={handleUsernameKeyDown}
                    onChange={(e) => updateLoginData("username", e.target.value)}
                    placeholder="Dein Username 💕"
                    className={`w-full p-4 rounded-xl border-2 focus:border-pink-300 focus:ring-4 
                                focus:ring-pink-100 outline-none transition-all text-base ${
                        errors.username ? "border-red-300 bg-red-50" : "border-pink-50 bg-white/50"
                    }`}
                />
            </div>

            <div className="text-left">
                <label className="text-xs font-bold text-purple-400 uppercase tracking-widest ml-2 mb-1 block">
                    Passwort
                </label>
                <input
                    type="password"
                    enterKeyHint="done"
                    value={loginData.password}
                    ref={passwordInputRef}
                    onChange={(e) => updateLoginData("password", e.target.value)}
                    placeholder="Dein Passwort 🔐"
                    className={`w-full p-4 rounded-xl border-2 focus:border-pink-300 focus:ring-4 
                                focus:ring-pink-100 outline-none transition-all text-base ${
                        errors.password ? "border-red-300 bg-red-50" : "border-pink-50 bg-white/50"
                    }`}
                />
            </div>
            <RainbowButton
                isSubmit={true} isSaving={isSaving} text={"Let's go! 🚀"}
                actionEmoji={"🚀"} actionText={"Anmelden..."}
            />
        </form>
    )
}
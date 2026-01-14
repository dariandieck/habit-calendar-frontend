import {useRef, useState} from 'react';
import type {LoginData} from "../types/loginData.ts";
import {login} from "../services/api.service.ts";
import type {TokenData} from "../types/tokenData.ts";
import * as React from "react";
import {useAuthContext} from "../context/AuthContext.tsx";

type ErrorState = {
    username: boolean;
    password: boolean;
};

export function LoginPage() {
    const [loginData, setLoginData] = useState<LoginData>({password: "", username: ""});
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState<ErrorState>({username: false, password: false});
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const { setTokenData } = useAuthContext();

    const handleUsernameKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Verhindere, dass das Formular schon jetzt abschickt
            passwordInputRef.current?.focus(); // Springe zum Passwort-Feld
        }
    };

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

    const updateLoginData = (field: "username" | "password", value: string)=> {
        setLoginData(prev => ({...prev, [field]: value}));
        // Fehler-State updaten
        setErrors(prev => ({...prev, [field]: value.trim() === ""}));
    }

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const anyErrors = detectErrorsInInputFields();
        if (anyErrors) {
            alert("Bitte alle Felder ausfüllen :)");
            return;
        }
        setIsSaving(true);
        setTimeout(async () => {
            try {
                const loginResponse: TokenData = await login(loginData)
                if (loginResponse.success) {
                    localStorage.setItem("access_token", loginResponse.access_token);
                    localStorage.setItem("exp", loginResponse.expire);
                    console.log("User logged in!");
                    setTokenData(loginResponse);
                } else {
                    console.log(`Could not login. Reason: ${loginResponse.message}`);
                    alert(`Konnte nicht anmelden: ${loginResponse.message}`);
                }
            } catch (error) {
                console.log(`Exception while logging in. Error: ${error}`);
                alert(`Konnte nicht anmelden: ${error}`);
            } finally {
                setIsSaving(false);
            }
        }, 2000);

    };

    return (
        <div className="login-overlay flex justify-center items-start">
            <div className="flex justify-center items-baseline-last p-4">
                <div
                    className="w-full max-w-md bg-white backdrop-blur-xl p-10 rounded-3xl
                    shadow-2xl border border-pink-100 text-center">

                    {/* Header Bereich */}
                    <div className="mb-8">
                        <div className="text-5xl mb-4 animate-bounce inline-block">🔒</div>
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-purple-500">
                            Schön, dass du da bist!
                        </h1>
                        <p className="text-gray-400 italic text-sm mt-2">
                            Zuerst musst du dich anmelden (ist sicherer 💅)
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
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

                        <div className="relative group w-full h-[64px] flex items-center justify-center">
                            {/* DER REGENBOGEN-KREISEL (Jetzt auch aktiv wenn isSaving wahr ist) */}
                            <div className="absolute inset-0 overflow-hidden rounded-2xl">
                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] aspect-square 
                        bg-[conic-gradient(from_0deg,#ff0000,#ff8000,#ffff00,#00ff00,#00ffff,#0000ff,#8000ff,#ff00ff,#ff0000)] 
                        ${isSaving ? 'opacity-100 animate-[rainbow-spin_1s_linear_infinite] blur-md' : 'opacity-0 group-hover:opacity-100 group-hover:animate-rainbow-spin'} 
                        transition-all duration-500`}>
                                </div>
                            </div>

                            {/* DER BUTTON */}
                            <button
                                disabled={isSaving}
                                type="submit"
                                className={`relative z-20 overflow-hidden w-[calc(100%-8px)] h-[calc(100%-8px)] 
                        ${isSaving ? 'bg-white text-pink-500' : 'bg-linear-to-r from-pink-400 to-purple-500 text-white'}
                        font-bold rounded-[14px] shadow-lg transition-all duration-500
                        flex items-center justify-center gap-3 overflow-hidden`}
                            >
                                {isSaving ? (
                                    <>
                                        <span className="animate-bounce">🚀</span>
                                        <span className="tracking-widest uppercase text-sm">Anmelden...</span>
                                        <span className="animate-bounce">🚀</span>
                                    </>
                                ) : (
                                    <span>Let's go! 🚀</span>
                                )}
                            </button>
                        </div>
                    </form>

                    <p className="mt-8 text-xs text-gray-400 italic">
                        Passwort vergessen? Frag einfach deinen Lieblings-Schmari 🧸
                    </p>
                </div>
            </div>
        </div>
    );
}
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import {BrowserRouter} from "react-router-dom";
import "./index.css"
import {AppDataProvider} from "./context/AppDataContext.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";

createRoot(document.getElementById('root')!).render(
    <div
        className="bg-pink-50 font-sans text-gray-700
            min-h-screen pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
    >
        <StrictMode>
            <AuthProvider>
                <AppDataProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </AppDataProvider>
            </AuthProvider>
        </StrictMode>
    </div>

)
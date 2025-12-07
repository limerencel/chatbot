"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import LoginForm from "./ui/LoginForm";

// ========================================
// CONTEXT TYPE - What's available globally
// ========================================
interface AuthContextType {
    // Auth state
    isAuthenticated: boolean;
    isLoading: boolean;

    // Modal state
    isLoginOpen: boolean;

    // Actions
    openLogin: () => void;
    closeLogin: () => void;
    login: (password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ========================================
// THE PROVIDER - Wraps your app
// ========================================
export function ModalProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Start as loading
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    // ====================================
    // CHECK AUTH ON APP LOAD
    // ====================================
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth");
                const data = await res.json();
                setIsAuthenticated(data.authenticated);
            } catch (error) {
                console.error("Auth check failed:", error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // ====================================
    // LOGIN FUNCTION
    // ====================================
    const login = async (password: string): Promise<boolean> => {
        try {
            const res = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                setIsAuthenticated(true);
                setIsLoginOpen(false);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    // ====================================
    // LOGOUT FUNCTION
    // ====================================
    const logout = async () => {
        try {
            await fetch("/api/auth", { method: "DELETE" });
            setIsAuthenticated(false);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const openLogin = () => setIsLoginOpen(true);
    const closeLogin = () => setIsLoginOpen(false);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                isLoginOpen,
                openLogin,
                closeLogin,
                login,
                logout,
            }}
        >
            {children}

            {/* Login modal renders here */}
            {isLoginOpen && <LoginForm onClose={closeLogin} />}
        </AuthContext.Provider>
    );
}

// ========================================
// HOOK TO USE AUTH - Call from any component
// ========================================
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within ModalProvider");
    }
    return context;
}

// Keep useModal as alias for backwards compatibility
export const useModal = useAuth;

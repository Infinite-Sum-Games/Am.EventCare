import React, { createContext, useContext } from "react";
import { axiosClient } from "@/lib/axios";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

interface User {
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isFetching: boolean;
    checkSession: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: sessionData, isLoading: isSessionLoading, isFetching, refetch } = useQuery({
        queryKey: ["session"],
        queryFn: async () => {
            const { data } = await axiosClient.get(api.SESSION);
            return data;
        },
        retry: false,
    });

    const user = sessionData ? {
        name: sessionData.name,
        email: sessionData.email,
    } : null;

    const { mutate: logout } = useMutation({
        mutationFn: async () => {
            await axiosClient.post(api.LOGOUT);
        },
        onSuccess: () => {
            queryClient.setQueryData(["session"], null);
            toast.success("Logged out successfully");
            navigate({ to: "/login" });
        },
        onError: () => {
            toast.error("Logout failed. Please try again.");
        },
    });

    const checkSession = async () => {
        await refetch();
    }

    return (
        <AuthContext.Provider value={{ user, isLoading: isSessionLoading, isFetching, checkSession, logout: async () => logout() }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

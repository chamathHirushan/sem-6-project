import { useState, useEffect, createContext, useContext } from "react";
import { auth } from "../../firebase.config";
import Spinner from "../components/Loading/Spinner";
import { apiClient } from "../api/client";

// Create context
export const AuthContext = createContext<any>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const handleAuthStateChange = async (firebaseUser: any) => {
            if (firebaseUser) {
                setUserLoggedIn(true);
                try {
                    const storedUser = sessionStorage.getItem("sewaUser");
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    } else {
                        const fetchedUser = await apiClient.post("/auth/login", undefined);
                        setUser(fetchedUser);
                        sessionStorage.setItem("sewaUser", JSON.stringify(fetchedUser));
                }
                } catch (error) {
                    console.error("Error getting ID token:", error);
                }
            } else {
                setUser(null);
                setUserLoggedIn(false);
            }
            setIsLoading(false);
        };

        const unsubscribe = auth.onAuthStateChanged(handleAuthStateChange);
        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner colour="#205781" size="80px" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, userLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook to access auth data
export const useAuth = () => useContext(AuthContext);
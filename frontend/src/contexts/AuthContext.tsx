import { useState, useEffect, createContext, useContext } from "react";
import { auth } from "../../firebase.config";
import Spinner from "../components/Loading/Spinner";
import { setAccessToken } from "../utils/tokenStore";
import { getUser } from "../api/authAPI";
import {toast} from "react-toastify";

// Create context
export const AuthContext = createContext<any>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const handleAuthStateChange = async (firebaseUser: any) => {
            if (firebaseUser) {
                try {
                    if (!firebaseUser.emailVerified) {
                        await firebaseUser.sendEmailVerification();
                        toast.error("Please verify your email address to log in.");
                        auth.signOut();
                        return;
                    }
                    setUserLoggedIn(true);
                    const storedUser = sessionStorage.getItem("sewaUser");
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    } else {
                        const fetchedAuth = await getUser() as { user: any, token: string };
                        if (fetchedAuth.token) {setAccessToken(fetchedAuth.token);}

                        const fetchedUser = fetchedAuth.user;
                        setUser(fetchedUser);
                        sessionStorage.setItem("sewaUser", JSON.stringify(fetchedUser));
                }
                } catch (error) {
                    console.error("Error getting ID token:", error);
                }
            } else {
                sessionStorage.clear();
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
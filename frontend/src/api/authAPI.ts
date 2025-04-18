import { apiClient } from "./client";
import { auth } from "../../firebase.config";

export const getUser = async () => {
    const firebaseToken = await auth.currentUser?.getIdToken();
    const response = await apiClient.post("/auth/me", { token: firebaseToken });
    return response;
}

export const signout = async () => {
    await auth.signOut();
    await apiClient.post("/auth/signout", {});
}
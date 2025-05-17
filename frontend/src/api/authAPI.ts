import { apiClient } from "./client";
import { auth } from "../../firebase.config";

export const storePhoneNumber = async (email:string, phone_number: string) => {
    await apiClient.post("/auth/store-phone", {
        email: email,
        phone_number: phone_number });
}

export const getUser = async () => {
    const firebaseToken = await auth.currentUser?.getIdToken();
    const response = await apiClient.post("/auth/me", { token: firebaseToken });
    return response;
}

export const signout = async () => {
    await auth.signOut();
    await apiClient.post("/auth/signout", {});
}
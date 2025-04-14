import { auth } from "../../firebase.config";

export async function logoutUser(navigate: (path: string) => void) {
    await auth.signOut();
    sessionStorage.clear();
    navigate("/login");
}
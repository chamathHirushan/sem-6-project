import { signout } from "../api/authAPI";

export function logoutUser(navigate: (path: string) => void) {
    signout();
    navigate("/");
}
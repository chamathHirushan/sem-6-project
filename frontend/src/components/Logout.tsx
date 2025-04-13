import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase.config";

export default function Logout() {
    const navigate = useNavigate();

    const logout = async () => {
        await auth.signOut();
        sessionStorage.clear();
        navigate("/login");
    };

    return (
        <button
            onClick={logout}
            className="text-gray-700 text-start block px-4 py-2 text-sm w-full"
        >
            Logout
        </button>
    );
}

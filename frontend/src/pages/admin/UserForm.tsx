import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiClient } from "../../api/client";

interface UserFormData {
    name: string;
    email: string;
    phone_number: string;
    town: string;
    permission_level: number;
    pro_pic?: string;
}

export default function UserForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<UserFormData>({
        name: "",
        email: "",
        phone_number: "",
        town: "",
        permission_level: 1,
    });

    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            const response = await apiClient.get(`/user/users/${id}`);
            setFormData(response.data);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (id) {
                await apiClient.put(`/user/users/${id}`, formData);
            } else {
                await apiClient.post("/user/users", formData);
            }
            navigate("/users");
        } catch (error) {
            console.error("Error saving user:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "permission_level" ? parseInt(value) : value,
        }));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{id ? "Edit User" : "Create User"}</h1>
            <form onSubmit={handleSubmit} className="max-w-lg">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Phone Number</label>
                    <input
                        type="tel"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Town</label>
                    <input
                        type="text"
                        name="town"
                        value={formData.town}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Permission Level</label>
                    <select
                        name="permission_level"
                        value={formData.permission_level}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value={1}>Level 1</option>
                        <option value={2}>Level 2</option>
                        <option value={3}>Level 3</option>
                    </select>
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        {id ? "Update" : "Create"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/users")}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
} 
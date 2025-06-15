import { useEffect, useState } from "react";
import { apiClient } from "../../api/client";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import {
  DeleteConfirmationModal,
  EditConfirmationModal,
} from "../../components/UserPopup";

interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  town: string;
  permission_level: number;
  pro_pic: string | null;
  created_at: string;
}

interface Role {
  level: number;
  name: string;
}

const permissionLevelMap: Record<number, Role> = {
  1: { level: 1, name: "User(Unverified)" },
  2: { level: 2, name: "User" },
  3: { level: 3, name: "Moderator" },
  4: { level: 4, name: "Admin" },
};

const getRoleName = (level: number): string => {
  return permissionLevelMap[level]?.name || "Unknown";
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [toText, setToText] = useState<string>("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/user/users");
      console.log("Fetched users:", response);
      const data = Array.isArray(response) ? response : [];
      setUsers(data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching users");
      setLoading(false);
      console.error("API Error:", error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await apiClient.delete(`/user/users/${userId}`);
      fetchUsers(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleRequestDeleteUser = (userId: number) => {
    setSelectedUserId(userId);
    setShowDeletePopup(true);
  };

  const handleRequestEditUser = (userId: number) => {
    const user = users.find((user) => user.id === userId);
    if (user?.permission_level === 3) {
      setToText("User");
    } else if (user?.permission_level === 2) {
      setToText("Moderator");
    }
    setSelectedUserId(userId);
    setShowEditPopup(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUserId !== null) {
      handleDeleteUser(selectedUserId);
      setShowDeletePopup(false);
      setSelectedUserId(null);
    }
  };

  const handleConfirmEdit = () => {
    if (selectedUserId !== null) {
      const updatedUsers = users.map((user) => {
        if (user.id === selectedUserId) {
          return {
            ...user,
            permission_level:
              user.permission_level === 3
                ? 2
                : user.permission_level === 2
                  ? 3
                  : user.permission_level,
          };
        }
        return user;
      });

      setUsers(updatedUsers);
      setShowEditPopup(false);
      setSelectedUserId(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeletePopup(false);
    setSelectedUserId(null);
  };

  const handleCloseEditModal = () => {
    setShowEditPopup(false);
    setSelectedUserId(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users Management</h1>
      <div className="grid gap-4">
        {Array.isArray(users) && users.length > 0 ? (
          users.map((userItem) => (
            <div key={userItem.id} className="border p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{userItem.name}</h2>
                  <p className="text-gray-600">{userItem.email}</p>
                  <p className="text-gray-600">
                    Phone: {userItem.phone_number}
                  </p>
                  <p className="text-gray-600">Town: {userItem.town}</p>
                  <p className="text-gray-600">
                    Permission Level: {getRoleName(userItem.permission_level)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/users/edit/${userItem.id}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRequestDeleteUser(userItem.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No users found.</div>
        )}
      </div>

      <button
        onClick={() => navigate("/users/create")}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Add New User
      </button>

      <DeleteConfirmationModal
        isOpen={showDeletePopup}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      <EditConfirmationModal
        to={toText}
        isOpen={showEditPopup}
        onClose={handleCloseEditModal}
        onConfirm={handleConfirmEdit}
      />
    </div>
  );
}

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
    <div className="flex flex-col bg-background p-6 max-w-full mx-auto">
      <div className="flex items-center justify-between mb-6 relative">
        <h1 className="text-2xl font-bold text-primary">Users Management</h1>
        <div className="ml-auto">
          <input
        type="text"
        placeholder="Search by name, email or role"
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary text-black min-w-[300px]"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="py-3 px-4 text-left font-semibold" onClick={() => handleSort('name')}>Name {sortConfig.key === 'name' && (<span className="text-xs align-middle">
                {sortConfig.direction === 'asc' ? '▲' : '▼'}
              </span>)}</th>
              <th className="py-3 px-4 text-left font-semibold" onClick={() => handleSort('email')}>Email {sortConfig.key === 'email' && (<span className="text-xs align-middle">
                {sortConfig.direction === 'asc' ? '▲' : '▼'}
              </span>)}</th>
              <th className="py-3 px-4 text-left font-semibold" onClick={() => handleSort('permission_level')}> Role {sortConfig.key === 'permission_level' && (<span className="text-xs align-middle">
                {sortConfig.direction === 'asc' ? '▲' : '▼'}
              </span>)}</th>
              <th className="py-3 px-4 text-left font-semibold" onClick={() => handleSort('createdAt')}>Created Time {sortConfig.key === 'createdAt' && (<span className="text-xs align-middle">
                {sortConfig.direction === 'asc' ? '▲' : '▼'}
              </span>)}</th>
              <th className="py-3 px-4 text-center w-16"></th>
              <th className="py-3 px-4 text-center w-16"></th>
              <th className="py-3 px-4 text-center w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentUsers.map((user, index) => (
              <tr 
                key={user.id} 
                className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="py-3 px-4 text-primary">{user.name}</td>
                <td className="py-3 px-4 text-primary">{user.email}</td>
                <td className="py-3 px-4">
                  <span 
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      Number(user.permission_level) === 4 
                        ? "bg-primary text-white" 
                        : Number(user.permission_level) === 3 
                          ? "bg-secondary text-white" 
                          : "bg-accent text-primary"
                    }`}
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

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { apiClient } from "../../api/client";

import { ChevronLeftIcon, ChevronRightIcon, EyeIcon, TrashIcon, PencilIcon  } from '@heroicons/react/24/solid';
import {DeleteConfirmationModal} from "../../components/UserPopup";
import {EditConfirmationModal} from "../../components/UserPopup";
import { toast } from "react-toastify";
        

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
  4: { level: 4, name: "Admin" }
};

const getRoleName = (level: number): string => {
  return permissionLevelMap[level]?.name || "Unknown";
};

export default function Users() {
  const [backendData, setBackendData] = useState<string>("Loading...");
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiClient.get("/admin/dashboard");
        setBackendData(response.message || "No data received");
      } catch (error) {
        setBackendData("Error fetching data");
        console.error("API Error:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <UserManagementTable />
    </>
  );
}

const UserManagementTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [toText, setToText] = useState<string>("");
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get("/user/users/");
      setAllUsers(response.data || response); // Handle different response structures
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Delete user via API
  const deleteUser = async (userId: number) => {
    try {
      await apiClient.delete(`/user/users/${userId}`);
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user");
      return false;
    }
  };

  // Update user permission level via API
  const updateUserPermissionLevel = async (userId: number, newPermissionLevel: number) => {
    try {
      await apiClient.patch(`/user/users/${userId}/level`, {
        permission_level: newPermissionLevel
      });
      return true;
    } catch (error) {
      console.error("Error updating user permission:", error);
      setError("Failed to update user permission");
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRequestDeleteUser = (userId: number) => {
    setSelectedUserId(userId);
    setShowDeletePopup(true);
  };

  const handleRequestEditUser = (userId: number) => {
    console.log("Requesting edit for user ID:", userId);
    const user = allUsers.find(user => user.id === userId);
    if (user?.permission_level === 3) {
      setToText("User");
    } else if (user?.permission_level === 2) {
      setToText("Moderator");
    }
    console.log("User permission level:", user?.permission_level);
    console.log("To text:", toText);
    setSelectedUserId(userId);
    setShowEditPopup(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUserId !== null) {
      const updatedUsers = allUsers.filter(user => user.id !== selectedUserId);
      setAllUsers(updatedUsers);
      setShowDeletePopup(false);
      setSelectedUserId(null);
      // TODO: Replace with actual delete API call
      toast.success(`User deleted successfully`);
    }
  };

  const handleConfirmEdit = () => {
  if (selectedUserId !== null) {
    const updatedUsers = allUsers.map(user => {
      if (user.id === selectedUserId) {
        return {
          ...user,
          permission_level: user.permission_level === 3 ? 2 :
                            user.permission_level === 2 ? 3 :
                            user.permission_level // leave unchanged if not 2 or 3
        };
      }
      return user;
    });
    // Update roleName for display/logging if needed
    const updatedUser = updatedUsers.find(user => user.id === selectedUserId);
    let roleName = getRoleName(Number(updatedUser?.permission_level) || 1);
    // You can use roleName for logging or UI feedback if needed

    setAllUsers(updatedUsers);
    setShowEditPopup(false);
    setSelectedUserId(null);
    
    // TODO: Replace with actual update API call
    toast.success(`Changed the permission of user to ${roleName}`);
  }
};

        const success = await updateUserPermissionLevel(selectedUserId, newPermissionLevel);
        if (success) {
          // Refresh the users list
          await fetchUsers();
          setShowEditPopup(false);
          setSelectedUserId(null);
        }
      }
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
  
  // const [allUsers, setAllUsers] = useState<any[]>([]);
  useEffect(() => {
    // fetchUsers(); // No fetchUsers function, using static data
  }, []);

  // Sample user data
  const InitallUsers = [
    { id: 1, name: "Sewalk admin", permission_level: 4, email:"codeclouts@gmail.com", createdAt: new Date("2025-02-15T10:30:00") },
    { id: 2, name: "Sarah Johnson", permission_level: 3, email:"johnson@gmail.com", createdAt: "2025-01-22T08:45:00" },
    { id: 3, name: "Michael Chen", permission_level: 2, email:"mmichael@gmail.com", createdAt: "2025-02-14T14:15:00" },
    { id: 4, name: "Emma Wilson", permission_level: 3, email:"emma23@gmail.com", createdAt: "2025-03-05T09:20:00" },
    { id: 5, name: "David Garcia", permission_level: 1, email:"olivia@gmail.com", createdAt: "2025-03-18T16:30:00" },
    { id: 6, name: "Olivia Brown", permission_level: 1, email:"obrown@gmail.com", createdAt: "2025-03-30T11:45:00" },
    { id: 7, name: "James Lee", permission_level: 2, email:"jamesle@gmail.com", createdAt: "2025-04-10T13:10:00" },
    { id: 8, name: "Sophia Martinez", permission_level: 3, email:"sophia@gmail.com", createdAt: "2025-04-22T15:25:00" },
    { id: 9, name: "Daniel Taylor", permission_level: 2, email:"taylor12s@gmail.com", createdAt: "2025-05-01T10:05:00" },
    { id: 10, name: "Isabella Anderson", permission_level: 1, email:"isabella@gmail.com", createdAt: "2025-05-12T14:50:00" },
    { id: 11, name: "David Garcia", permission_level: 1, email:"olivia@gmail.com", createdAt: "2025-03-18T16:30:00" },
    { id: 12, name: "Olivia Brown", permission_level: 1, email:"obrown@gmail.com", createdAt: "2025-03-30T11:45:00" },
    { id: 13, name: "James Lee", permission_level: 2, email:"jamesle@gmail.com", createdAt: "2025-04-10T13:10:00" },
    { id: 14, name: "Sophia Martinez", permission_level: "Moderator", email:"sophia@gmail.com", createdAt: "2025-04-22T15:25:00" },
    { id: 15, name: "Daniel Taylor", permission_level: 2, email:"taylor12s@gmail.com", createdAt: "2025-05-01T10:05:00" },
    { id: 16, name: "Isabella Anderson", permission_level: 1, email:"isabella@gmail.com", createdAt: "2025-05-12T14:50:00" },
  ];

  const [allUsers, setAllUsers] = useState(InitallUsers);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const handleSort = (key: string) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';

    const sorted = [...allUsers].sort((a, b) => {
      let aVal = a[key as keyof User];
      let bVal = b[key as keyof User];

      if (key === 'created_at') {
        aVal = new Date(aVal as string);
        bVal = new Date(bVal as string);
      }

      if (typeof aVal === 'string') {
        return direction === 'asc'
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }

      if (typeof aVal === 'number' || aVal instanceof Date) {
        return direction === 'asc'
          ? (aVal as any) > (bVal as any) ? 1 : -1
          : (aVal as any) < (bVal as any) ? 1 : -1;
      }

      return 0;
    });

    setSortConfig({ key, direction });
    setAllUsers(sorted);
  };

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getRoleName(user.permission_level).toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to handle view user details
  const handleViewUser = (userId: number) => {

    const user = allUsers.find(u => u.id === userId);
    if (user) {
      alert(`User Details:\nName: ${user.name}\nEmail: ${user.email}\nPhone: ${user.phone_number}\nTown: ${user.town}\nRole: ${getRoleName(user.permission_level)}`);
    }

  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-primary">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-lg text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-80"
        >
          Retry
        </button>
      </div>
    );
  }

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

        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-secondary text-white rounded-md hover:opacity-80"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="py-3 px-4 text-left font-semibold cursor-pointer" onClick={() => handleSort('name')}>
                Name {sortConfig.key === 'name' && (
                  <span className="text-xs align-middle">
                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th className="py-3 px-4 text-left font-semibold cursor-pointer" onClick={() => handleSort('email')}>
                Email {sortConfig.key === 'email' && (
                  <span className="text-xs align-middle">
                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th className="py-3 px-4 text-left font-semibold cursor-pointer" onClick={() => handleSort('permission_level')}>
                Role {sortConfig.key === 'permission_level' && (
                  <span className="text-xs align-middle">
                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th className="py-3 px-4 text-left font-semibold cursor-pointer" onClick={() => handleSort('created_at')}>
                Created Time {sortConfig.key === 'created_at' && (
                  <span className="text-xs align-middle">
                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
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
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${user.permission_level === 4
                      ? "bg-primary text-white"
                      : user.permission_level === 3
                        ? "bg-secondary text-white"
                        : "bg-accent text-primary"
                      }`}
                  >
                    {getRoleName(user.permission_level)}
                  </span>
                </td>
                <td className="py-3 px-4 text-primary">{formatDate(user.created_at)}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleViewUser(user.id)}
                    className="p-1 rounded-md border transition-opacity"
                    title="View Details"
                  >
                    <EyeIcon className="w-5 h-5 text-primary hover:opacity-80 transition-opacity" />
                  </button>
                </td>
                <td className="py-3 px-4 text-center">
                  {(user.permission_level !== 4 && user.permission_level > 1) ? (
                    <button
                      onClick={() => handleRequestEditUser(user.id)}
                      title="Change Role"
                    >
                      <PencilIcon className="w-5 h-5 text-secondary hover:opacity-80 transition-opacity" />
                    </button>
                  ) : (
                    <span className="p-1"></span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {user.permission_level !== 4 ? (
                    <button
                      onClick={() => handleRequestDeleteUser(user.id)}
                      title="Delete User"
                    >
                      <TrashIcon className="w-5 h-5 text-red-400 hover:opacity-80 transition-opacity" />
                    </button>
                  ) : (
                    <span className="p-1"></span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-primary">
          Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
        </div>

        {Math.ceil(filteredUsers.length / usersPerPage) > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md flex items-center justify-center bg-secondary hover:opacity-80 transition-opacity ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              title="Previous Page"
            >
              <ChevronLeftIcon className="w-5 h-5" color="background" />
            </button>

            {[...Array(Math.ceil(filteredUsers.length / usersPerPage))].map((_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === i + 1 ? 'bg-primary text-white' : 'bg-background text-primary border border-secondary'
                  }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage < Math.ceil(filteredUsers.length / usersPerPage) ? currentPage + 1 : currentPage)}
              disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
              className={`p-2 rounded-md flex items-center justify-center bg-secondary hover:opacity-80 transition-opacity ${currentPage === Math.ceil(filteredUsers.length / usersPerPage) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              title="Next Page"
            >
              <ChevronRightIcon className="w-5 h-5" color="background" />
            </button>
          </div>)}
      </div>
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
};
import { use, useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { apiClient } from "../../api/client";
import { ChevronLeftIcon, ChevronRightIcon, EyeIcon, TrashIcon, PencilIcon  } from '@heroicons/react/24/solid';

export interface Role {
  level: number;
  name: string;
}

export const permissionLevelMap: Record<number, Role> = {
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
      const {user} = useAuth();
    
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
        {/* <p>Logged as level {user.role} user</p>
        Users page content goes here.
        <p>{backendData}</p> */}
        <UserManagementTable/>
      </>
    );
  }

const UserManagementTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // const [allUsers, setAllUsers] = useState<any[]>([]);
  useEffect(() => {
    // fetchUsers(); // No fetchUsers function, using static data
  }, []);

  // Sample user data
  const InitallUsers = [
    { id: 1, name: "John Smith", permission_level: 4, email:"john2003@gmail.com", createdAt: "2024-11-15T10:30:00" },
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
      let aVal = a[key];
      let bVal = b[key];

      if (key === 'createdAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      if (typeof aVal === 'string') {
        return direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (typeof aVal === 'number' || aVal instanceof Date) {
        return direction === 'asc'
          ? aVal > bVal ? 1 : -1
          : aVal < bVal ? 1 : -1;
      }

      return 0;
    });

    setSortConfig({ key, direction });
    setAllUsers(sorted);
  };
  

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
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
    alert(`View details for user ID: ${userId}`);
  };

  // Function to handle delete user
  const handleDeleteUser = (userId: number) => {
    const updatedUsers = allUsers.filter(user => user.id !== userId);
    setAllUsers(updatedUsers);
    alert(`Delete user ID: ${userId}`);
  };

  // Function to handle change role
  const handleChangeRole = (userId: number, currentRole: string) => {
    const newRole = currentRole === "User" ? "Moderator" : "User";
    alert(`Change role for user ID: ${userId} from ${currentRole} to ${newRole}`);
  };

  return (
    <div className="flex flex-col bg-background p-6 max-w-full mx-auto">
       <div className="relative flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#205781]">Users Management</h1>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <input
            type="text"
            placeholder="Search by name..."
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary text-black min-w-[400px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full bg-white border-collapse">
          <thead>
            <tr className="bg-[#205781] text-white">
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
                <td className="py-3 px-4 text-[#205781]">{user.name}</td>
                <td className="py-3 px-4 text-[#205781]">{user.email}</td>
                <td className="py-3 px-4">
                  <span 
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      Number(user.permission_level) === 4 
                        ? "bg-[#205781] text-white" 
                        : Number(user.permission_level) === 3 
                          ? "bg-[#4F959D] text-white" 
                          : "bg-[#98D2C0] text-[#205781]"
                    }`}
                  >
                    {getRoleName(Number(user.permission_level))}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#205781]">{formatDate(user.createdAt)}</td>
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
                  {Number(user.permission_level) !== 4 ? (
                    <button
                      onClick={() => handleChangeRole(user.id, getRoleName(Number(user.permission_level)))}
                      title="Change Role"
                    >
                      <PencilIcon className="w-5 h-5 text-secondary hover:opacity-80 transition-opacity" />
                    </button>
                  ) : (
                    <span className="p-1"></span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {Number(user.permission_level) !== 4 ? (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
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
        <div className="text-sm text-[#205781]">
          Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
        </div>

        {Math.ceil(filteredUsers.length / usersPerPage) > 1 && (    
        <div className="flex items-center space-x-2">
          <button
            onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-md flex items-center justify-center bg-[#4F959D] hover:opacity-80 transition-opacity ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Previous Page"
          >
            <ChevronLeftIcon className="w-5 h-5" color="#F6F8D5" />
          </button>
          
          {[...Array(Math.ceil(filteredUsers.length / usersPerPage))].map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                currentPage === i + 1 ? 'bg-[#205781] text-white' : 'bg-[#F6F8D5] text-[#205781] border border-[#4F959D]'
              }`}
            >
              {i + 1}
            </button>
          ))}
          
          <button
            onClick={() => paginate(currentPage < Math.ceil(filteredUsers.length / usersPerPage) ? currentPage + 1 : currentPage)}
            disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
            className={`p-2 rounded-md flex items-center justify-center bg-[#4F959D] hover:opacity-80 transition-opacity ${
              currentPage === Math.ceil(filteredUsers.length / usersPerPage) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Next Page"
          >
            <ChevronRightIcon className="w-5 h-5" color="#F6F8D5" />
          </button>
        </div>)}
      </div>
    </div>
  );
};
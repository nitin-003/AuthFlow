import { useEffect, useState } from "react";
import api from "../api/axios";
import UserActions from "./UserActions";
import EditUserModal from "./EditUserModel";
import ChangePasswordModal from "./ChangePasswordModel";
import { useNavigate } from "react-router-dom";

function UserManagement(){
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try{
        const res = await api.get("/user/all");
        setUsers(res.data);
      } 
      catch(err){
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">

      {/* Main Card */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg border overflow-hidden">

        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-6 text-sm font-medium opacity-90 hover:opacity-100"
          >
            ← Back
          </button>

          <h2 className="text-center text-xl font-bold tracking-wide">
            User Management
          </h2>

          <p className="text-center text-sm text-blue-100 mt-1">
            Manage users, roles & credentials
          </p>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-3 px-6 py-3 bg-gray-100 text-sm font-semibold text-gray-700 border-b sticky top-0 z-10">
          <span>Name</span>
          <span className="text-center">Email</span>
          <span className="text-right">Actions</span>
        </div>

        {/* User List */}
        <div className="divide-y max-h-[65vh] overflow-y-auto">
          {users.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-lg font-semibold text-gray-500">
                No users found
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Users will appear here once added
              </p>
            </div>
          ) : (
            users.map((user) => (
              <div
                key={user._id}
                className="grid grid-cols-3 px-6 py-4 items-center hover:bg-blue-50 transition-all duration-200"
              >
                {/* Name + Avatar */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold uppercase">
                    {user.name.charAt(0)}
                  </div>

                  <span className="font-semibold text-gray-800 truncate">
                    {user.name}
                  </span>
                </div>

                {/* Email */}
                <span className="text-gray-600 truncate text-center">
                  {user.email}
                </span>

                {/* Actions */}
                <div className="flex justify-end">
                  <UserActions user={user} setUsers={setUsers}
                    onEdit={() => {
                      setSelectedUser(user);
                      setEditOpen(true);
                    }}
                    onPassword={() => {
                      setSelectedUser(user);
                      setPasswordOpen(true);
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {editOpen && (
        <EditUserModal user={selectedUser} setUsers={setUsers}
          onClose={() => setEditOpen(false)}
        />
      )}

      {/* Change Password Modal */}
      {passwordOpen && (
        <ChangePasswordModal
          user={selectedUser}
          onClose={() => setPasswordOpen(false)}
        />
      )}
    </div>
  );
}

export default UserManagement;



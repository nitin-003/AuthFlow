import { useEffect, useState } from "react";
import api from "../api/axios";
import UserActions from "./UserActions";
import EditUserModal from "./EditUserModel";
import ChangePasswordModal from "./ChangePasswordModel";
import { useNavigate } from "react-router-dom";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/user/all");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="relative p-4 bg-white border-b flex items-center">
        {/* Back Button - Left */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 text-sm text-blue-600 hover:underline"
        >
          ← Back
        </button>

        {/* Title - Center */}
        <h2 className="mx-auto font-semibold text-lg">List of All Users</h2>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 px-4 py-2 bg-gray-50 font-medium text-sm border-b">
        <span className="text-left">Name</span>
        <span className="text-center">Email</span>
        <span className="text-right">Actions</span>
      </div>

      {/* User List */}
      <div className="overflow-y-auto">
        {users.map(user => (
          <div key={user._id} className="grid grid-cols-3 px-4 py-3 border-b bg-white items-center">
            {/* Name - Left */}
            <span className="truncate text-left">{user.name}</span>

            {/* Email - Center */}
            <span className="truncate text-center">{user.email}</span>

            {/* Actions - Right */}
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
        ))}
      </div>

      {/* Edit User Modal */}
      {editOpen && (
        <EditUserModal
          user={selectedUser}
          setUsers={setUsers}
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



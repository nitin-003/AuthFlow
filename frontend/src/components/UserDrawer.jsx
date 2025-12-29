import { useEffect, useState } from "react";
import api from "../api/axios";
import UserActions from "./UserActions";
import EditUserModel from "./EditUserModel";
import ChangePasswordModel from "./ChangePasswordModel";

function UserDrawer({ open, setOpen }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/user/all");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    if (open) {
      fetchUsers();
    }
  }, [open]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-3/4 bg-white z-50 transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between">
          <h2 className="font-semibold">List of All Users</h2>
          <button onClick={() => setOpen(false)}>✖</button>
        </div>

        <div className="overflow-y-auto">
          {users.map((user) => (
            <div key={user._id} className="grid grid-cols-3 px-4 py-3 border-b">
              <span>{user.name}</span>
              <span className="truncate">{user.email}</span>

              <UserActions
                user={user}
                setUsers={setUsers}
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
          ))}
        </div>
      </div>

      {editOpen && (
        <EditUserModel
          user={selectedUser}
          setUsers={setUsers}
          onClose={() => setEditOpen(false)}
        />
      )}

      {passwordOpen && (
        <ChangePasswordModel
          user={selectedUser}
          onClose={() => setPasswordOpen(false)}
        />
      )}
    </>
  );
}

export default UserDrawer;


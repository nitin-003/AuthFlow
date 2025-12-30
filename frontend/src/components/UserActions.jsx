import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

function UserActions({ user, setUsers, onEdit, onPassword }){
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    if(!window.confirm("Delete this user ?")) return;

    try{
      await api.delete(`/user/${user._id}`);

      setUsers(prev => prev.filter(u => u._id !== user._id));

      toast.success("User deleted successfully 🗑️");
      setOpen(false);
    } 
    catch(err){
      toast.error(
        err.response?.data?.message || "Delete failed ❌"
      );
    }
  };

  return (
    <div className="relative ml-auto">
      <button onClick={() => setOpen(!open)}>⋮</button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow z-50">
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Edit
          </button>

          <button
            onClick={() => {
              onPassword();
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100"
          >
            Change Password
          </button>

          <button
            onClick={handleDelete}
            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default UserActions;




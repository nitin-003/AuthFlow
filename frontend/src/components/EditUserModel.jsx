import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

function EditUserModal({ user, setUsers, onClose }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try{
      setLoading(true);

      const res = await api.put(`/user/${user._id}`, { name, email });

      setUsers(prev =>
        prev.map(u => (u._id === user._id ? res.data : u))
      );

      toast.success("User updated successfully 🎉");
      onClose();
    } 
    catch(err){
      toast.error(err.response?.data?.message || "Failed to update user ❌");
    } 
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded w-96">
        <h3 className="font-semibold mb-3">Edit User</h3>

        <input value={name} onChange={e => setName(e.target.value)} className="w-full mb-2 border p-2"/>

        <input value={email} onChange={e => setEmail(e.target.value)} className="w-full mb-4 border p-2"/>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>

          <button onClick={handleSave} disabled={loading}
            className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditUserModal;




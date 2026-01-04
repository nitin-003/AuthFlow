import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

function ChangePasswordModal({ user, onClose }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    if(!password || password.length < 6){
      toast.error("Password must be at least 6 characters");
      return;
    }

    try{
      setLoading(true);

      await api.put(`/user/${user._id}`, { password });

      toast.success("Password changed successfully 🔐");
      onClose();
    } 
    catch(err){
      toast.error(err.response?.data?.message || "Failed to change password ❌");
    } 
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded w-96">
        <h3 className="font-semibold mb-3">Change Password</h3>

        <input type="password" placeholder="New Password" value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 border p-2"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>

          <button onClick={handleChange} disabled={loading}
            className="bg-green-600 text-white px-4 py-1 rounded disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordModal;



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

function User() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user");
        setName(res.data.name);
        setEmail(res.data.email);
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  // Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();

    if(!window.confirm("Are you sure you want to update your profile?")) return;

    try{
      const updateData = { name, email };

      if (password.trim()) {
        updateData.password = password;
      }

      await api.put("/user", updateData);
      toast.success("Profile updated successfully ✅");
      setPassword("");
      navigate("/home");
    } 
    catch(err){
      toast.error(err.response?.data?.message || "Update failed ❌");
    }
  };

  // Delete account
  const handleDelete = async () => {
    if(!window.confirm("Are you sure you want to delete your account?")) return;

    try{
      await api.delete("/user");
      toast.success("Account deleted successfully 🗑️");
      navigate("/signup");
    } 
    catch(err){
      toast.error("Delete failed ❌");
    }
  };

  if(loading){
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleUpdate}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <button type="button" onClick={() => navigate(-1)}
          className="text-sm text-blue-600 mb-3 hover:underline"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">
          My Profile
        </h2>

        <input type="text" placeholder="Name" value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />

        <input type="email" placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 border rounded"
        />

        <input type="password" placeholder="New Password (optional)" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded mb-3 hover:bg-blue-700"
        >
          Update Profile
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Delete Account
        </button>
      </form>
    </div>
  );
}

export default User;




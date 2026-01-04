import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useEffect, useState } from "react";

function Home(){
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try{
        const res = await api.get("/user");
        setUserName(res.data.name);
      } 
      catch(err){
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try{
      await api.post("/auth/logout");
      navigate("/login");
    } 
    catch(err){
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex">

      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow-xl p-6">
        <h3 className="text-xl font-bold text-blue-600 mb-6">
          Dashboard
        </h3>

        <div className="space-y-3">
          <button onClick={() => navigate("/users")}
            className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-blue-200 text-gray-700 font-medium transition"
          >
            👤 User Management
          </button>

          <button onClick={() => navigate("/products")}
            className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-blue-200 text-gray-700 font-medium transition"
          >
            📦 Product Management
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">

        {/* Top Bar */}
        <div className="absolute top-4 right-6 flex items-center gap-4">
          <span onClick={() => navigate("/user")}
            className="cursor-pointer font-semibold text-gray-700 hover:text-blue-600"
          >
            {userName}
          </span>

          <button onClick={handleLogout}
            className="bg-red-400 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Center Content */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white p-10 rounded-xl shadow-lg text-center">
            <h2 className="text-3xl font-bold text-blue-600 mb-2">
              Welcome, {userName}
            </h2>
            <p className="text-gray-600">
              Manage users and products from the dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;



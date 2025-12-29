import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useEffect, useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user");
        setUserName(res.data.name);
      } catch (err) {
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
    <div className="min-h-screen bg-gray-100 relative">

      <div className="absolute top-4 right-4 flex items-center gap-4">
        <span onClick={() => navigate("/user")}
          className="cursor-pointer font-semibold text-gray-800 hover:text-blue-600"
        >
          {userName}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div onClick={() => navigate("/users")}
        className="absolute top-4 left-4 cursor-pointer font-semibold text-gray-800 hover:text-blue-600"
      >
        User Management
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-3xl font-bold text-blue-600">
          Welcome, {userName}
        </h2>
      </div>
    </div>
  );
}

export default Home;



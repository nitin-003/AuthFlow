import './App.css';
import { BrowserRouter as Router, Route, Navigate, Routes } from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/SignUp';
import Home from './pages/Home';
import User from './pages/User';
import UserManagement from "./components/UserManagementPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Products from './pages/Products';

function App(){
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/home" element={<Home />} />
        <Route path="/user" element={<User />} />

        <Route path="/users" element={<UserManagement />} />
        <Route path="/products" element={<Products />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} />
    </Router>
  );
}

export default App;



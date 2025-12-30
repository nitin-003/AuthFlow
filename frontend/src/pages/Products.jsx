import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import { useNavigate } from "react-router-dom";

export default function Products(){
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try{
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data);
    } 
    catch(err){
      if(err.response?.status === 401){
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } 
      else{
        toast.error("Failed to load products");
      }
    } 
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      
      {/* HEADER */}
      <div className="relative mb-8 flex items-center">
        {/* BACK BUTTON (LEFT) */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          ← Back
        </button>

        {/* CENTER TITLE */}
        <h2 className="mx-auto text-2xl font-bold text-blue-600">
          Product Management
        </h2>
      </div>

      <ProductForm
        fetchProducts={fetchProducts}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />

      <ProductTable
        products={products}
        fetchProducts={fetchProducts}
        setSelectedProduct={setSelectedProduct}
        loading={loading}
      />
    </div>
  );
}



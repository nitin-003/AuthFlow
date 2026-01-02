import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";

export default function Products(){
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try{
      setLoading(true);
      const res = await api.get("/products");
      setProducts(Array.isArray(res.data) ? res.data : []);
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
  }, [navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="relative mb-8 flex items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 bg-gray-200 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-300"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h2 className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-blue-600">
          Product Management
        </h2>

        <button
          disabled={loading}
          onClick={() => {
            setSelectedProduct(null);
            setShowModal(true);
          }}
          className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white
            ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
          `}
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* TABLE */}
      <ProductTable products={products} loading={loading}
        fetchProducts={fetchProducts}
        onEdit={(product) => {
          setSelectedProduct(product);
          setShowModal(true);
        }}
      />

      {/* MODAL */}
      <Modal isOpen={showModal} onClose={closeModal}>
        <ProductForm
          fetchProducts={fetchProducts}
          selectedProduct={selectedProduct}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
}



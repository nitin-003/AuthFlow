import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import ProductForm from "../components/ProductForm";
import ProductTable from "../components/ProductTable";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Fetch products (memoized)
    const fetchProducts = useCallback(async () => {
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
    }, [navigate]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div className="p-8 bg-gray-100 min-h-screen">

            {/* HEADER */}
            <div className="relative mb-8 flex items-center">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1
                               bg-gray-100 text-gray-700
                               px-3 py-1.5 rounded-lg text-sm
                               hover:bg-gray-400 transition"
                >
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">Back</span>
                </button>

                <h2 className="mx-auto text-2xl font-bold text-blue-600">
                    Product Management
                </h2>
            </div>

            {/* PRODUCT FORM */}
            <ProductForm
                fetchProducts={fetchProducts}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
            />

            {/* PRODUCT TABLE */}
            <ProductTable
                products={products}
                loading={loading}
                fetchProducts={fetchProducts}
                setSelectedProduct={setSelectedProduct}
            />
        </div>
    );
}




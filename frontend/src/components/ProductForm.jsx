import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ProductForm({ fetchProducts, selectedProduct, setSelectedProduct }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        quantity: "",
        category: "",
    });

    useEffect(() => {
        if (selectedProduct) {
            setFormData({
                name: selectedProduct.name,
                price: selectedProduct.price,
                quantity: selectedProduct.quantity,
                category: selectedProduct.category,
            });
        }
    }, [selectedProduct]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (selectedProduct) {
                await api.put(`/products/${selectedProduct._id}`, formData);
                toast.success("Product updated");
            }
            else {
                await api.post("/products", formData);
                toast.success("Product created");
            }

            setFormData({ name: "", price: "", quantity: "", category: "" });
            setSelectedProduct(null);
            fetchProducts();
        } 
        catch(err){
            if(err.response?.status === 401){
                toast.error("Session expired. Login again.");
                navigate("/login");
            } 
            else{
                toast.error("Operation failed");
            }
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-4 rounded-xl shadow mb-6 grid grid-cols-12 gap-4 items-center"
        >
            {/* NAME */}
            <input
                name="name"
                placeholder="Product name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />

            {/* PRICE */}
            <input
                name="price"
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="col-span-2 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />

            {/* QTY */}
            <input
                name="quantity"
                type="number"
                placeholder="Qty"
                value={formData.quantity}
                onChange={handleChange}
                className="col-span-2 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />

            {/* CATEGORY */}
            <input
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                className="col-span-3 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />

            {/* ACTION BUTTONS */}
            <div className="col-span-2 flex gap-2">
                {selectedProduct ? (
                    <>
                        {/* UPDATE */}
                        <button type="submit"
                            className="flex-1 h-10 rounded text-white font-medium bg-yellow-500 hover:bg-yellow-600 transition"
                        >
                            Update
                        </button>

                        {/* CANCEL */}
                        <button type="button"
                            onClick={() => {
                                setSelectedProduct(null);
                                setFormData({
                                    name: "",
                                    price: "",
                                    quantity: "",
                                    category: "",
                                });
                            }}
                            className="flex-1 h-10 rounded bg-gray-300 hover:bg-gray-400 transition"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    /* ADD — FULL WIDTH */
                    <button type="submit"
                        className="w-full h-10 rounded text-white font-medium bg-blue-600 hover:bg-blue-700 transition"
                    >
                        Add Product
                    </button>
                )}
            </div>
        </form>
    );
}



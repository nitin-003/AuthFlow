import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ProductForm({ fetchProducts, selectedProduct, setSelectedProduct }){
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
  });

  useEffect(() => {
    if(selectedProduct){
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

    try{
      if(selectedProduct){
        await api.put(`/products/${selectedProduct._id}`, formData);
        toast.success("Product updated");
      } 
      else{
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
      className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-4 gap-4"
    >
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />

      <input
        name="price"
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />

      <input
        name="quantity"
        type="number"
        placeholder="Quantity"
        value={formData.quantity}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />

      <input
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        className="border p-2 rounded"
        required
      />

      <button
        type="submit"
        className="col-span-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {selectedProduct ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}




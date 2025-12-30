import api from "../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ProductTable({ products, fetchProducts, setSelectedProduct, loading }){
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure to delete this product ?")) return;

    try{
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } 
    catch(err){
      if(err.response?.status === 401){
        toast.error("Session expired");
        navigate("/login");
      } 
      else{
        toast.error("Delete failed");
      }
    }
  };

  const updateStock = async (id, qty) => {
    try{
      await api.patch(`/products/${id}/inventory`, { quantity: qty });
      toast.success("Inventory updated");
      fetchProducts();
    } 
    catch(err){
      if(err.response?.status === 401){
        toast.error("Session expired");
        navigate("/login");
      } 
      else{
        toast.error("Inventory update failed");
      }
    }
  };

  if(loading) return <p>Loading...</p>;

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Price</th>
            <th className="p-3">Qty</th>
            <th className="p-3">Category</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-3">{p.name}</td>
              <td className="p-3">₹{p.price}</td>
              <td className="p-3">{p.quantity}</td>
              <td className="p-3">{p.category}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => setSelectedProduct(p)}
                  className="px-3 py-1 bg-yellow-400 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => updateStock(p._id, 1)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  +1
                </button>
                <button
                  onClick={() => updateStock(p._id, -1)}
                  className="px-3 py-1 bg-gray-600 text-white rounded"
                >
                  -1
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



